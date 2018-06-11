const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateLogin = user => {
  user.password = !isEmpty(user.password) ? user.password : "";
  user.email = !isEmpty(user.email) ? user.email : "";
  //   console.log(user.email);
  const errors = {};
  if (Validator.isEmpty(user.email)) {
    errors.email = "Email is required";
  }
  if (!Validator.isEmail(user.email)) {
    errors.email = "Please enter valid email";
  }
  if (Validator.isEmpty(user.password)) {
    errors.password = "Password is required";
  }
  return {
    isValid: isEmpty(errors),
    errors
  };
};
module.exports = validateLogin;
