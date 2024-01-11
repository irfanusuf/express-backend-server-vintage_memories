const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const registerController = async (req, res) => {


  try {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({ email })


    

    if (username !== "") {
      if (!existingUser) {



        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: "user created" })

      }
      else {

        res.json({ message: "user Already Exits" })
      }

    }

    else {
      res.status(401).json({ message: "All credentials Required" })
    }

  }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }

}







const loginController = (req, res) => {


}




const logoutController = (req, res) => {


}



module.exports = { registerController, loginController, logoutController }