const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateExperience = experience => {
  experience.title = !isEmpty(experience.title) ? experience.title : "";
  experience.company = !isEmpty(experience.company) ? experience.company : "";
  experience.from = !isEmpty(experience.from) ? experience.from : "";

  let errors = {};
  if (Validator.isEmpty(experience.title)) {
    errors.title = "Experience title can't be empty";
  }
  if (Validator.isEmpty(experience.company)) {
    errors.company = "Experience company can't be empty";
  }
  if (Validator.isEmpty(experience.from)) {
    errors.from = "Experience from Date can't be empty";
  }
  return {
    isValid: isEmpty(errors),
    errors
  };
};

module.exports = validateExperience;
