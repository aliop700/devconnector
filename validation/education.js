const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateEducation = education => {
  education.school = !isEmpty(education.school) ? education.school : "";
  education.degree = !isEmpty(education.degree) ? education.degree : "";
  education.fieldofstudy = !isEmpty(education.fieldofstudy)
    ? education.fieldofstudy
    : "";
  education.from = !isEmpty(education.from) ? education.from : "";

  let errors = {};
  if (Validator.isEmpty(education.school)) {
    errors.title = "School can't be empty";
  }
  if (Validator.isEmpty(education.degree)) {
    errors.company = " Degree can't be empty";
  }
  if (Validator.isEmpty(education.fieldofstudy)) {
    errors.company = " Field of study can't be empty";
  }
  if (Validator.isEmpty(experience.from)) {
    errors.from = "Experience from Date can't be empty";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};

module.exports = validateEducation;
