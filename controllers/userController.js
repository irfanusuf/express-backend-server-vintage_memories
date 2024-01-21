const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");
const secretKey = process.env.SECRET_KEY;

//register function whenever this function will be called it will accept payload in json username ,email......
//password and save that data in mongo document User

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (username && email && password !== "") {
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "user created" });
      } else {
        res.json({ message: "user Already Exits" });
      }
    } else {
      res.status(401).json({ message: "All credentials Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const isUser = await User.findOne({ username });
    if (username !== "" && password !== "") {
      if (isUser) {
        const passVerify = await bcrypt.compare(password, isUser.password);
        if (passVerify) {
          const token = await jwt.sign(
            { appUser: isUser.username },
            `${secretKey}`
          );

        
          res.cookie("token", token, {httpOnly : true});

          res.json({ message: "Logged In", token });



        } else {
          res.json({ message: "Password Doesnot Match" });
        }
      } else {
        res.json({ message: "User Not Found" });
      }
    } else {
      res.json({ message: "All Credentials Required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const logoutController = async (req, res) => {
  try {
    const { token } = req.params.q;

    if (token) {
      await jwt.verify(token, `${secretKey}`, (err, decoded) => {
        if (err) {
          console.log(err);
          res.json({ message: "invalid token " });
        }

        if (decoded) {
          console.log(decoded);
          res.clearCookie("token");
          res.json({ message: "logged Out succesfuly" });
        }
      });
    } else {
      res.json({ message: "Some went Wrong " });
    }
  } catch (error) {
    console.log(Error);
    res.json({ message: "internal server Error " });
  }
};

const forgotpassController = async (req, res) => {
  try {
    const { email } = req.body; // u can take answer of the security question for further validation
    const isUser = await User.findOne({ email });

    const _id = isUser._id;

    if (email !== "") {
      if (isUser) {
        res.json({ message: "Kindly change Ur password With newOne ", _id });

        // console.log(isUser._id);
        // security Question  validation here
        // redirection to the new page in which new password can be saved
      } else {
        res.json({ message: "No user Found" });
      }
    } else {
      res.json({ message: "Email required!" });
    }
  } catch (error) {
    console.log(error);
  }
};

const changepassController = async (req, res) => {
  try {
    const { _id, newpassWord } = req.body;
    const hashedPassword = await bcrypt.hash(newpassWord, 10);

    // this method finds user by id and updates its password then load new userinformation in memory

    const changePassword = await User.findByIdAndUpdate(_id, {
      password: hashedPassword,
    });

    if (changePassword) {
      res.json({ message: "Password Changed " });
    } else {
      res.json({ message: " somethig went wrong " });
    }

    // this methods find user be id and loads it in memory then the second instruction changes
    // paswword and the new user is loaded  again
    // in memory
    // const validUser = await User.findById({ _id });
    // if (validUser) {
    //   validUser.password = hashedPassword;

    //   await validUser.save();

    //   res.json({ message: " password changed " });
    // } else {
    //   res.json({ message: " something Went Wrong" });
    // }
  } catch (error) {
    console.log(error);
  }
};


// home Work 
//   deleteuser 
// make two controllers first in which u will take confirmation and redirect the user to deletepage 
// delte controler payload _id        method findbyIDanddelete 

module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotpassController,
  changepassController,
};













// const changePassword =await User.findByIdAndUpdate( _id ,  {password : hashedPassword})
// if (changePassword) {

//   console.log(changePassword)
//   res.json({message : "password changed "})
// }
// else {
//   res.json({message : "something went wrong "})
// }
