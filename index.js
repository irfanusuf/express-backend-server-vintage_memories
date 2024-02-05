const express = require("express"); // importing express from node modules in index.js  which is used for creating server
const mongoose = require("mongoose"); // importing mongoose libarary which is used for connecting mongo db
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multMidWare = require("./mddlewares/multer");
const {
  registerController,
  loginController,
  logoutController,
  forgotpassController,
  changepassController, 
  deleteController,
} = require("./controllers/userController");


const IsAuthenticated = require ('./mddlewares/auth')



const { postHandler, likeHandler , commentHandler , deletePostHandler}  = require("./controllers/postController");

const app = express(); //  declaring a variable  app in which express function is called
// app.use(express.json()) //  using express encoding itself
  



app.use(bodyParser.json()); //  using third party libarary
app.use(cookieParser());

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
app.get("/home", (req, res) => {
  res.send("helloworld");
});

// all the routes for user are below
app.post("/user/register", registerController);
app.post("/user/login", loginController);
app.post("/user/forgotPassword", forgotpassController);
app.post("/user/changePassword", changepassController);
app.post("/user/logout", logoutController);
app.post("/user/delete", deleteController);

app.get("/user/getFollowers", (req, res) => {
  res.send("No followers");
});
app.get("/user/getFollowing", (req, res) => {
  res.send("No following");
});

// all the routes for posts are below

app.post("/post/new", multMidWare, postHandler);
app.post("/post/likes", IsAuthenticated,likeHandler);
app.post("/post/comment" ,IsAuthenticated, commentHandler)
app.post("/post/delete" ,IsAuthenticated, deletePostHandler)


//  starting a server      //console.log   =>template literal
app.listen(Port, console.log(`server conected on localhost : ${Port} `));
