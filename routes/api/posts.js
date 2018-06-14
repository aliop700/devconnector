const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//load post model
const Post = require("../../models/Post");

//load new Post validation
const validatePost = require("../../validation/post");

//@route POST /api/post
//@desc add new post
//@access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validatePost(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);
