const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const db = require("./config/keys").mongoURI;
//connect to database
mongoose
  .connect(db)
  .then(() => console.log("db connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hiiii"));
//passport js middleware
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);
//bodyparser middle ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//route files
const users = require("./routes/api/users");
const profiles = require("./routes/api/profile");
const posts = require("./routes/api/posts");
//use these routes
app.use("/api/users", users);
app.use("/api/profile", profiles);
app.use("api/post", posts);
app.listen(5000, () => console.log("listenong"));
