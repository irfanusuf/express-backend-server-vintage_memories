const Post = require("../models/postModel");
const cloudinary = require('cloudinary');




cloudinary.config({
  cloud_name: 'dbo0xmbd7',
  api_key: '717735839128615',
  api_secret: 'fqcjtd3HxpH_t1dAEtqr595ULW0'
});



const postHandler = async (req, res) => {
  try {
      const {title ,  caption} = req.body

      const imagePath = req.file.path
     
      // const imagePath = "./uploads/path";
      const  upload = await cloudinary.v2.uploader.upload(imagePath , {folder :  "socialApp" })
       
      const imageUrl =  upload.secure_url


      if (imageUrl !== ""){
         const  newPost = new Post({title, imageUrl, caption})
         await newPost.save()
         res.status(201).json({message : "Post Uploaded"})
      }
      else {
        res.json({message : "select image"})
      }


  } 
  
  catch (error) {
    res.json({ message: error });
    console.log(error);
  }
};

module.exports =  postHandler ;
