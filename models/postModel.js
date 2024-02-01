const mongoose = require ('mongoose')



const postschema = mongoose.Schema({
author : String,
title : String , 
imageUrl : String,
caption : String,
likeCounts: [],
comments : [{ comment : String , username : String }],
shareCounts : []


})

const Post  = mongoose.model('Post' , postschema )


module.exports = Post