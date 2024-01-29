const Post = require("../models/postModel");
const cloudinary = require("cloudinary");
const User = require("../models/userModel");

cloudinary.config({
  cloud_name: "dbo0xmbd7",
  api_key: "717735839128615",
  api_secret: "fqcjtd3HxpH_t1dAEtqr595ULW0",
});

const postHandler = async (req, res) => {
  try {
    const { title, caption } = req.body;

    const imagePath = req.file.path;
    const _id = req.query._id;       // req.user id 

    // const imagePath = "./uploads/path";
    const upload = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "socialApp",
    });

    const imageUrl = upload.secure_url;

    if (imageUrl !== "") {
      const newPost = new Post({ title, imageUrl, caption });
      await newPost.save();
      const postId = newPost._id

      await User.findByIdAndUpdate(_id, { $push: { posts: postId} });

      res.status(201).json({ message: "Post Uploaded" , postId  });
    } else {
      res.json({ message: "select image" });
    }
  } catch (error) {
    res.json({ message: error });
    console.log(error);
  }
};

const likeHandler = async (req, res) => {
  try {
    const _id = req.query.postId; //  requesting post  id
    const userId = req.query.userId; // requesting user id


    if (!_id) {
      res.json({ message: "Post not found!" });
    } else {
      const liked = await Post.findByIdAndUpdate(_id, {
        $push: { likeCounts: userId },
      });


      if (liked) {
        res.json({ message: "U Liked This Post!" });
      }
    }
  } catch (error) {
    res.json({ message: "server Error" });
  }
};

module.exports = { postHandler, likeHandler };
