const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateRigister = user => {
  user.name = !isEmpty(user.name) ? user.name : "";
  user.password = !isEmpty(user.password) ? user.password : "";
  user.password2 = !isEmpty(user.password2) ? user.password2 : "";
  user.email = !isEmpty(user.email) ? user.email : "";
  //   console.log(user.email);
  const errors = {};
  if (!Validator.isLength(user.name, { min: 6, max: 18 })) {
    errors.name = "The length of name must be between 6 and 18";
  }
  if (!Validator.isEmail(user.email)) {
    errors.email = "Please enter valid email";
  }
  if (!Validator.isLength(user.password, { min: 8, max: 30 })) {
    errors.password = "Password must be between 8 and 30 charachters";
  }
  if (!Validator.equals(user.password, user.password2)) {
    errors.password2 = "The confirm must match the password";
  }
  return {
    isValid: isEmpty(errors),
    errors
  };
};
module.exports = validateRigister;
