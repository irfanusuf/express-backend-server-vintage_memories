const express =  require ('express')       // importing express from node modules in index.js  which is used for creating server 
const mongoose = require ('mongoose')   // importing mongoose libarary which is used for connecting mongo db 
const  istFunction =require('./controllers/userController')
const  secondfunction =require('./controllers/userController')




const app = express()     //  declaring a variable  app in which express function is called 

// configuring env so that  we can save senstive data in protected file 
require('dotenv').config();
const Port = process.env.PORT     // declaring a variable and passing a value of from env
const url = process.env.MONGO_URL    // declaring a variable url and passing a value of from env


// connecting with  mongo db by using mongoose 

if(mongoose.connect(url)){
  console.log( `Database connected on ${url}`)
} else {
  console.log( `Error connecting ${url}`)
}







// routes 

app.get('/home', istFunction)
app.get('/get/gallery', secondfunction )


  //  starting a server 
app.listen(Port , console.log( `server conected on localhost : ${Port} `))       //console.log   =>template literal