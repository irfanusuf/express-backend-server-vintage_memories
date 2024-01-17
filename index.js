const express = require('express')       // importing express from node modules in index.js  which is used for creating server 
const mongoose = require('mongoose')     // importing mongoose libarary which is used for connecting mongo db 
const bodyParser = require('body-parser')
const { registerController,
  loginController,
  logoutController,
  forgotpassController } = require('./controllers/userController')


const app = express()      //  declaring a variable  app in which express function is called 
// app.use(express.json()) //  using express encoding itself 
app.use(bodyParser.json()) //  using third party libarary 


// configuring env so that  we can save senstive data in protected file 
require('dotenv').config();
const Port = process.env.PORT      // declaring a variable and passing a value of from env
const url = process.env.MONGO_URL // declaring a variable url and passing a value of from env


// connecting with  mongo db by using mongoose 
if (mongoose.connect(url)) {
  console.log(`Database connected on ${url}`)
} else {
  console.log(`Error connecting ${url}`)
}







// routes 
app.get('/', (req, res) => { res.send("helloworld") })
app.post('/user/register', registerController)
app.post('/user/login', loginController)
app.post('/user/logout', logoutController)
app.post('/user/forgotPassword', forgotpassController)


//  starting a server      //console.log   =>template literal
app.listen(Port, console.log(`server conected on localhost : ${Port} `))       