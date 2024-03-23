const express = require("express"); // importing express from node modules in index.js  which is used for creating server
const mongoose = require("mongoose"); // importing mongoose libarary which is used for connecting mongo db
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors =require('cors')
const multMidWare = require("./middlewares/multer");
const IsAuthenticated = require("./middlewares/auth");
const {
  registerController,
  loginController,
  logoutController,
  forgotpassController,
  changepassController,
  deleteController,
  followUserHandler,
  getUser
} = require("./controllers/userController");


const {
  createNewpostHandler,
  likeHandler,
  commentHandler,
  deletePostHandler,
  deleteCommentHandler,
  sharePostHandler,
  getAllposts
} = require("./controllers/postController");

const app = express(); //  declaring a variable  app in which express function is called
// app.use(express.json()) //  using express encoding itself

app.use(bodyParser.json()); //  using third party libaray for parsing json body data 
app.use(cookieParser());   //   using third party libaray for parsing cookies 
app.use(cors())    // cross origin resource sharing 

// configuring env so that  we can save senstive data in protected file
require("dotenv").config();
const Port = process.env.PORT; // declaring a variable and passing a value of from env
const url = process.env.MONGO_URL; // declaring a variable url and passing a value of from env

// connecting with  mongo db by using mongoose
if (mongoose.connect(url)) {
  console.log(`Database connected on ${url}`);
} else {
  console.log(`Error connecting ${url}`);
}

// routes

// all the routes for user are below

app.post("/user/register", multMidWare , registerController);
app.post("/user/login", loginController);
app.get("/user" , getUser) 
app.post("/user/forgotPassword", forgotpassController);
app.post("/user/changePassword", changepassController);
app.post("/user/logout", logoutController);
app.post("/user/delete", deleteController);


app.post("/user/follow" , followUserHandler)  // home work

app.get("/user/getFollowers", (req, res) => {
  res.send("No followers");
});
app.get("/user/getFollowing", (req, res) => {
  res.send("No following");
});



// all the routes for posts are below
 
app.post("/post/new", multMidWare, IsAuthenticated  ,createNewpostHandler);
app.post("/post/deletePost",IsAuthenticated ,  deletePostHandler);
app.post("/post/likes", IsAuthenticated, likeHandler);     // depends on user ..... like and unlike can work from single handler 
app.post("/post/comment", IsAuthenticated, commentHandler);
app.post("/post/deleteCommment",IsAuthenticated , deleteCommentHandler);
app.post("/post/sharePost",IsAuthenticated , sharePostHandler);
app.get("/posts", IsAuthenticated, getAllposts);





//  starting a server      //console.log   =>template literal
app.listen(Port, console.log(`server conected on localhost : ${Port} `));
