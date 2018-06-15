const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//load post model
const Post = require("../../models/Post");

//load new Post validation
const validatePost = require("../../validation/post");

//@route GET /api/post
//@desc get all posts
//@access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json(err));
});

//@route GET /api/post/:id
//@desc get Post by id
//@access public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(400).json({ nopostfound: "No post found with that id" })
    );
});

//@route DELETE /api/post/:id
//@desc Delete Post by id
//@access private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ id: req.params.id })
      .then(post => {
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({
            notauthorizedpost: "You are not authorized to delete this post"
          });
        }
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//@route POST /api/post/unlike/:id
//@desc like post
//@access private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length === 0
      ) {
        return res.status(400).json({ msg: "you have not liked the post" });
      }

      const removeIndex = post.likes
        .map(item => item.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);

      post.save().then(post => res.json(post));
    });
  }
);

//@route POST /api/post/like/:id
//@desc like post
//@access private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id).then(post => {
      if (
        post.likes.filter(like => like.user.toString() === req.user.id).length >
        0
      ) {
        return res.status(400).json({ msg: "already liked post" });
      }

      post.likes.unshift({ user: req.user.id });

      post.save().then(post => res.json(post));
    });
  }
);

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
