const mongoose = require ('mongoose')



const User = mongoose.model('User',  {
profilepIcUrl : String,
username : String,
email :  {type : String , unique : true},
password : {type : String , required : true} ,
posts: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
userFollowers : [] ,
userFollowing: []


} )




module.exports = User 