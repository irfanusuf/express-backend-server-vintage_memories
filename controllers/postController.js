const Post = require("../models/postModel");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/userModel");
const transporter = require("../utils/nodemailer");

const createNewpostHandler = async (req, res) => {
  try {
    const { title, caption } = req.body;

    const imagePath = req.file.path;
    const { userId } = req.query;

    const upload = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "socialApp",
    });

    const imageUrl = upload.secure_url;

    if (imageUrl !== "") {
      const newPost = new Post({ author: userId, title, imageUrl, caption });
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
    const userId = req.info._id;
    const { postId } = req.query; 

    const post = await Post.findById(postId);

    const alreadyLiked = await post.likeCounts.findIndex(
      (user) => user.user._id.toString() === userId
    );

    if (!post) {
      res.json({ message: "Post not found!" });
    } else {


      if (alreadyLiked === -1) {

        await post.likeCounts.push({user : userId}); // simple javascript array method
        await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
        const updatePost = await post.save();

        if (updatePost) {
          res.json({ message: `U Liked post _${postId}`});
        }
      } else {

        await post.likeCounts.splice(alreadyLiked , 1)
        await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
        const savePost = await post.save()

        if(savePost){

          res.json({ message: `U unliked post_${postId}` });
        }
            
      }
    }
  } catch (error) {
    res.json({ message: error  + "some error"});
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

const deletePostHandler = async (req, res) => {
  try {
    const userId = req.info._id;
    const { postId } = req.query;
    const isUser = await User.findById(userId);

    if (isUser) {
      const deletePost = await Post.findByIdAndDelete(postId);
      // const indexOfPostInUserArr = await isUser.posts.findIndex(
      //   (_id) => _id.toString() === postId
      // );
      // console.log(indexOfPostInUserArr);
      // const delFromUserArr = await isUser.posts.splice(0, 1);
      // console.log(delFromUserArr)

      const delfromArr = await User.findByIdAndUpdate(userId, {
        $pull: { posts: postId },
      });

      if (deletePost && delfromArr) {
        res.json({ message: "Post Deleted" });
      } else {
        res.json({ message: "Some Error : post not found  " });
      }
    } else {
      res.json({ message: "User not Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCommentHandler = async (req, res) => {
  try {
    const { postId } = req.query;
    const { commentId } = req.query;

    const post = await Post.findById(postId);

    const indexOfdelComment = await post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    console.log(indexOfdelComment);

    const delComment = await post.comments.splice(indexOfdelComment, 1);

    if (delComment) {
      await post.save();
      res.json({ message: "comment deleted " });
    } else {
      res.json({ message: "comment not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const sharePostHandler = async (req, res) => {
  const { email } = req.body;
  const { postId } = req.query;
  const userId = req.info; // logged in user

  const post = await Post.findById(postId);

  console.log(post);

  const author = "irfan usuf";
  const title = post.title;
  const image = post.imageUrl;
  const caption = post.caption;
  const link = "somelINk ";

  const sendMail = await transporter.sendMail({
    from: "irfanusuf33@gmail.com",
    to: `${email}`,
    subject: "share",
    text: `kindly check out this post ${link} on the social app and follow this user . He is very good at  creating innovating
    things  ${title}  ${image}   caption : ${caption} Author :  ${author} ,`,
  });

  if (sendMail) {
    await post.shareCounts.push({ user: userId });
    const update = post.save();
    if (update) {
      res.json({ message: "post shared " });
    }
  }
};

const getAllposts = async (req, res) => {
  try {
    const allposts = await Post.find().populate([
      {
        path: 'author',
        model: 'User',
      },

      {
        path: "likeCounts.user",
        model: "User",
      },
      {
        path: "comments.user",
        model: "User",
      },
      {
        path: "shareCounts.user",
        model: "User",
      },
    ]);

    if (allposts) {
      res.json({ message: "Posts Found!", allposts });
    } else {
      res.json({ message: " No posts found  " });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createNewpostHandler,
  likeHandler,
  commentHandler,
  deletePostHandler,
  deleteCommentHandler,
  sharePostHandler,
  getAllposts,
};
