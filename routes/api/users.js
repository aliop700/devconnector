const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;
const passport = require("passport");
///isEmpty function
const isEmpty = require("../../validation/is-empty");
//validate register
const validateRigestration = require("../../validation/register");
//validae login
const validateLogin = require("../../validation/login");
//@route POST /users/api/register
//@params [name , email , password,password2]
//@desc register new user

router.post("/register", (req, res) => {
  const { isValid, errors } = validateRigestration(req.body);
  if (!isValid) {
    return res.status(405).json(errors);
  }
  const email = req.body.email;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: gravatar.url(email, { s: "200", r: "pg", d: "404" }),
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, val) => {
            if (err) throw err;
            newUser.password = val;
            newUser
              .save()
              .then(user => {
                res.json({ msg: "User have been registerd", user: newUser });
              })
              .catch(err => console.log(err));
          });
        });
      } else {
        res.status(400).json({ msg: "User already registered" });
      }
    })
    .catch(err => console.log(err));
});
//@route POST /users/api/login
//@params [  email , password]
//@desc login  user
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { isValid, errors } = validateLogin(req.body);
  if (!isValid) {
    res.status(405).json(errors);
  }
  User.findOne({ email }).then(user => {
    if (!user) {
      res.status(404).json({ msg: "user not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({ msg: "login successfull" });
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        };
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        res.json({ msg: "incorrect password" });
      }
    });
  });
});
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("dsd");
    res.json(req.user);
  }
);
module.exports = router;
