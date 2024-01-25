const mongoose = require ('mongoose')



const User = mongoose.model('User',  {

username : String,
 
email :String,
password : {type : String , required : true} ,
userFollowers : [] ,
userFollowing: []


} )




module.exports = User 