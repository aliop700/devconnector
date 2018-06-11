const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateProfile = profile => {
  profile.handle = !isEmpty(profile.handle) ? profile.handle : "";
  profile.status = !isEmpty(profile.status) ? profile.status : "";
  profile.skills = !isEmpty(profile.skills) ? profile.skills : "";

  let errors = {};
  if (Validator.isEmpty(profile.handle)) {
    errors.handle = "Handle can't be empty";
  } else {
    if (!Validator.isLength(profile.handle, { min: 2, max: 40 })) {
      errors.handle = "Handle length must be between 2 and 40";
    }
  }
  if (Validator.isEmpty(profile.status)) {
    errors.status = "Profile status can't be empty";
  }
  if (Validator.isEmpty(profile.skills)) {
    errors.skills = "SKills cant be empty";
  }
  if (!isEmpty(profile.website)) {
    if (!Validator.isURL(profile.website)) {
      errors.website = "Please enter valid URL for your website";
    }
  }
  if (!isEmpty(profile.facebook)) {
    if (!Validator.isURL(profile.facebook)) {
      errors.facebook = "Please enter valid URL for your facebook";
    }
  }
  if (!isEmpty(profile.instagram)) {
    if (!Validator.isURL(profile.instagram)) {
      errors.instagram = "Please enter valid URL for your instagram";
    }
  }
  if (!isEmpty(profile.youtube)) {
    if (!Validator.isURL(profile.youtube)) {
      errors.youtube = "Please enter valid URL for your youtube";
    }
  }
  if (!isEmpty(profile.linkedin)) {
    if (!Validator.isURL(profile.linkedin)) {
      errors.linkedin = "Please enter valid URL for your linkedIn";
    }
  }
  if (!isEmpty(profile.twitter)) {
    if (!Validator.isURL(profile.twitter)) {
      errors.twitter = "Please enter valid URL for your twitter";
    }
  }
  return {
    isValid: isEmpty(errors),
    errors
  };
};
module.exports = validateProfile;
