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
    const { userId } = req.query;

    const upload = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "socialApp",
    });

    const imageUrl = upload.secure_url;

    if (imageUrl !== "") {
      const newPost = new Post({ title, imageUrl, caption });
      await newPost.save();

      const postId = newPost._id;

      await User.findByIdAndUpdate(userId, { $push: { posts: postId } });

      res.status(201).json({ message: "Post Uploaded", postId });
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
    const { userId } = req.query;
    const { postId } = req.query; //  requesting post  id
    //const username = req.info.username; // requesting username  from query / cookies

    const post = await Post.findById(postId);

    const alreadyLiked = false; //await post.likeCounts.includes(username);

    if (!post) {
      res.json({ message: "Post not found!" });
    } else {
      if (!alreadyLiked) {
        // method of mongo db
        // const liked = await Post.findByIdAndUpdate(_id, {
        //   $push: { likeCounts: username },
        // });

        // other method
        await post.likeCounts.push({ user: userId }); // simple javascript array method
        const updatePost = await post.save();

        if (updatePost) {
          res.json({ message: "U Liked This Post!" });
        }
      } else {
        res.json({ message: "Already liked the post " });
      }
    }
  } catch (error) {
    res.json({ message: error });
  }
};

const commentHandler = async (req, res) => {
  try {
    const userId = req.info._id;
    const comment = req.body.comment;
    const { postId } = req.query;

    const post = await Post.findById(postId);

    if (post) {
      // const addComment = await Post.findByIdAndUpdate(_id , {

      //     $push : {comments : {comment : comment , username  : username }}
      //   })

      await post.comments.push({ comment: comment, user: userId });
      const commentAdded = await post.save();

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

// homeWork right now any one with token can delete this post but only owner of this shoulb be able to del this post
// above one is not so important

// after delteing the post by this method .....post's Id should also be delted from user's post array
const deletePostHandler = async (req, res) => {
  try {
    const { postId } = req.query;

    const deletePost = await Post.findByIdAndDelete(postId);

    if (deletePost) {
      res.json({ message: "Post Deleted" });
    } else {
      res.json({ message: "Some Error : post not found  " });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCommentHandler = async (req, res) => {
  try {
    // const {userId} = req.info._id
    const {postId} = req.query;
    const {commentId} = req.query;

    const post = await Post.findById(postId);

    const indexOfdelComment = await post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    const delComment = await post.comments.splice(indexOfdelComment, 1);

    if (delComment) {
      await post.save();
    }


  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  postHandler,
  likeHandler,
  commentHandler,
  deletePostHandler,
  deleteCommentHandler,
};




















































// const userId = req.info._id;

// const user = await User.findById(userId);

// const containsPost = await user.posts.includes(postId);
// console.log(containsPost);
// const deletepostindex = await user.posts.findIndex(post => post.toString() === postId)
// console.log(deletepostindex);

// const deletefromUserArr = await user.posts.splice(deletepostindex,1)

// await user.save()

// console.log(deletefromUserArr);
