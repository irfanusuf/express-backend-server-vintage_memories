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
    const _id = req.query._id; // req.user id

    // const imagePath = "./uploads/path";
    const upload = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "socialApp",
    });

    const imageUrl = upload.secure_url;

    if (imageUrl !== "") {
      const newPost = new Post({ title, imageUrl, caption });
      await newPost.save();
      const postId = newPost._id;

      await User.findByIdAndUpdate(_id, { $push: { posts: postId } });

      res.status(201).json({ message: "Post Uploaded", postId });
    } else {
      res.json({ message: "select image" });
    }
  } catch (error) {
    res.json({ message: error });
    console.log(error);
  }
};

// home work
// validate user who likes the post and user should be in db  and second user should be logged in  
const likeHandler = async (req, res) => {
  try {
    const _id = req.query.postId; //  requesting post  id
    const username = req.query.username; // requesting username  from query
    const post = await Post.findById({ _id });

    const alreadyLiked = await post.likeCounts.includes(username);

    if (!post) {
      res.json({ message: "Post not found!" });
    } else {
      if (!alreadyLiked) {

        // method of mongo db
        const liked = await Post.findByIdAndUpdate(_id, {
          $push: { likeCounts: username },
        });



      

          // other method 
          await post.likeCounts.push(username)       // simple javascript array method 
         const updatePost = await post.save()

        if (updatePost) {
          res.json({ message: "U Liked This Post!" });
        }
      } else {
        res.json({ message: "Already liked the post " });
      }
    }
  } catch (error) {
    res.json({ message: error + "Server Error" });
  }
};
// home work
// validate user who likes the post and user should be in db  and second user should be logged in  
const commentHandler = async (req, res) => {
  try {
    const username = req.query.username;
    const comment = req.body.comment;
    const _id = req.query.postId;


    const post = await Post.findById(_id);


  

    if (post) {

  // const addComment = await Post.findByIdAndUpdate(_id , {

  //     $push : {comments : {comment : comment , username  : username }}
  //   })


      await post.comments.push({comment: comment , username : username});
      const commentAdded = await post.save()
     
      if (commentAdded) {
        res.json({ message: "comment Added" });
      } else {
        res.json({ message: "Some Error " });
      }
    } else {
      res.json({ message: "Post not found!" });
    }
  } catch (error) {
    console.log(error);
  }
};

const deletePostHandler = async (req, res) => {
  try {
    const _id = req.query.postId;
    const deletePost = await Post.findByIdAndDelete(_id);

    if (deletePost) {
      res.json({ message: "Post Deleted" });
    } else {
      res.json({ message: "Some Error : may be post is already deleted " });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postHandler, likeHandler, commentHandler , deletePostHandler };
