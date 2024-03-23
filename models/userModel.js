const mongoose = require("mongoose");
const Post = require("./postModel");

const User = mongoose.model("User", {



  
  profilepIcUrl: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },

  
  posts: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  ],

  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  userFollowers: [],
  userFollowing: [],
});

module.exports = User;
