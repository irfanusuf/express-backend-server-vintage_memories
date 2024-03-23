const mongoose = require("mongoose");
const User = require("./userModel");
// const uuid =require("uuid")

const postschema = mongoose.Schema({



  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },


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



  shareCounts: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],



});

const Post = mongoose.model("Post", postschema);

module.exports = Post;
