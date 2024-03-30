const mongoose = require("mongoose");
const Post = require("./postModel");

const User = mongoose.model("User", {
  profilepIcUrl: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  bio : String ,
  links : String,
  posts: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  ],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  commentsGiven : [{ type: mongoose.Schema.Types.ObjectId}],
  userFollowers: [{type : mongoose.Schema.Types.ObjectId , ref : "User" }  ],
  userFollowing: [{type : mongoose.Schema.Types.ObjectId , ref : "User" }  ],
});

module.exports = User;
