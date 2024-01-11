const mongoose = require ('mongoose')



const User = mongoose.model('User',  {

username : String, 
email :String,
password : {type : String , required : true} 



} )




module.exports = User 