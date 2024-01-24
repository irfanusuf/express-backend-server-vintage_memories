const Post = require("../models/postModel");

const postHandler = async (req, res) => {
  try {
      const {title , image , caption} = req.body

      if (secure_url !== ""){
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

module.exports = { postHandler };
