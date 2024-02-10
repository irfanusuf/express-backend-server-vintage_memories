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

    const alreadyLiked = await post.likeCounts.findIndex(
      (_id) => _id.toString() === userId
    );

    if (!post) {
      res.json({ message: "Post not found!" });
    } else {
      if (alreadyLiked === -1) {
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
  const postId = req.query;
  const userId = req.info;

  const post = await Post.findById(postId);

  const author = post.author;
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
    res.json({ message: "post shared " });
  }
};

module.exports = {
  createNewpostHandler,
  likeHandler,
  commentHandler,
  deletePostHandler,
  deleteCommentHandler,
  sharePostHandler
};
