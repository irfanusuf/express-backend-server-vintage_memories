const multer = require('multer');            // multer manges file upload system 

const upload = multer({  dest: 'uploads/'  ,  limits: {
  fieldSize: 1024 * 1024 * 10, 
}, }); 



// const storage = multer.memoryStorage()   //  accesssing the RAM memory 
// const upload = multer({ storage: storage })

const multMidWare = upload.single('image')



// const multMidWare2 = upload.single('file')



module.exports = multMidWare;