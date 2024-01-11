const mongoose = require ('mongoose')



const postschema = mongoose.Schema({

title : String , 
imageUrl : String,
author : String,
caption : String


})








const Post  = mongoose.Model('Post' , postschema )


module.exports = Post