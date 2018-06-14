const isEmpty = require("./is-empty");
const Validator = require("validator");

const validatePost = post => {
  post.text = !isEmpty(post.text) ? post.text : "";
  const errors = {};
  if (!Validator.isLength(post.text, { min: 10, max: 300 })) {
    errors.text = "Post length must be between 10 and 300 charachters";
  }
  if (Validator.isEmpty(post.text)) {
    errors.text = "Post text can't be empty";
  }

  return {
    isValid: isEmpty(errors),
    errors
  };
};

module.exports = validatePost;
