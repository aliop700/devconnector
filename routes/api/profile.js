const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// load models
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const validateProfile = require("../../validation/profile");
const validateExperience = require("../../validation/experience");
const validateEducation = require("../../validation/education");
//@route GET /api/profile
//@desc GET current users profile
//@access private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);
//@route POST /api/profile
//@desc Create or update  users profile
//@access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { isValid, errors } = validateProfile(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    errors = {};
    profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      console.log(req.user.id);
      if (profile) {
        //UPdate
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = " That handle already exists";
            res.status(400).json(errors);
          }
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
//@route GET /api/profile/handle/:handle
//@desc GET current profile by handle
//@access public
router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      let errors = {};
      if (!profile) {
        errors.noprofile = "No profile was found";
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json(profile));
});

//@route GET /api/profile/user/:user_id
//@desc GET current profile by ID
//@access public
router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      let errors = {};
      if (!profile) {
        errors.noprofile = "No profile was found";
        return res.status(404).json(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route GET /api/profile/all
//@desc GET all profiles
//@access public
router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      let errors = {};
      if (!profiles) {
        errors.noprofile = "No profile was found";
        return res.status(404).json(errors);
      }
      return res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

//@route POST /api/profile/experience
//@desc Add new Expereience
//@access private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { isValid, errors } = validateExperience(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    errors = {};
    const experience = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.noprofile = "No profile for this user";
        return res.status(404).json(errors);
      }

      profile.experience.unshift(experience);
      profile.save().then(profile => res.json(profile));
    });
  }
);
//@route POST /api/profile/education
//@desc Add new Education
//@access private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let { isValid, errors } = validateEducation(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    errors = {};
    const education = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (!profile) {
        errors.noprofile = "No profile for this user";
        return res.status(404).json(errors);
      }

      profile.education.unshift(education);
      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route DELETE /api/profile/experience/:exp_id
//@desc Delete experience
//@access private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const errors = {};
        if (!profile) {
          errors.noprofile = "no prifile for this user";
          return res.status(400).json(errors);
        }
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route DELETE /api/profile/education/:edu_id
//@desc Delete Education
//@access private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const errors = {};
        if (!profile) {
          errors.noprofile = "no prifile for this user";
          return res.status(400).json(errors);
        }
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        profile.experience.splice(removeIndex, 1);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route DELETE /api/profile/
//@desc Delete Profile
//@access private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: user.req.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
