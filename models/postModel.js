const mongoose = require("mongoose");
const User = require("./userModel");
// const uuid =require("uuid")

const postschema = mongoose.Schema({
  author: String,
  title: String,
  imageUrl: String,
  caption: String,
  likeCounts: [

    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      comment: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  shareCounts: [],
});

const Post = mongoose.model("Post", postschema);

module.exports = Post;
