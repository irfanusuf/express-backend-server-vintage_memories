const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//register function whenever this function will be called it will accept payload in json username ,email......
//password and save that data in mongo document User

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (username || email || password !== "") {
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

          const token = await jwt.sign({appUser : isUser.username} , 'sevenSprings')
          res.status(200).json({ message: "Logged In" } , token);
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

const logoutController = (req, res) => {};

const forgotpassController = (req, res) => {};

module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotpassController,
};
