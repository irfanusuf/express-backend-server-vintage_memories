const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require ("../utils/nodemailer")


const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (username && email && password !== "") {
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const sendMail =  await transporter.sendMail(
          {
            from : "irfanusuf33@gmail.com",
            to : `${email}`,
            subject : "Welecome Email ",
            text : `Welcome ${username} . Stay tuned For our upcoming Social App`
          }
        )
        if(sendMail){
            res.status(201).json({ message: "user created" });
        }
      
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
          const token = jwt.sign(
            {
              username: isUser.username,
              _id: isUser._id,
              profilepIcUrl: isUser.profilepIcUrl,
            },
            "sevensprings"
          );

          res.cookie("username" , username ,{ httpOnly: true });


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
    const token = req.cookies.token;

    if (token) {
      const decode = await jwt.verify(token, `${secretKey}`);

      if (decode) {
        res.clearCookie("token");
        res.json({ message: "logged Out succesfuly" });
      } else {
        res.json({ message: "some thing Went wrong " });
      }
    } else {
      res.json({ message: "missing token" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "internal server Error " });
  }
};

const forgotpassController = async (req, res) => {
  try {
    const { email } = req.body; // u can take answer of the security question for further validation
    const isUser = await User.findOne({ email });

    const mailOptions = {
      from: "irfanusuf33@gmail.com",
      to: `${email}`,
      subject: "Link For Changing Password",
      text: " some text ",
    };

    if (email !== "") {
      if (isUser) {
    

        await transporter.sendMail(mailOptions);

        res.json({
          message:
            " kindly check ur mail .We have provided a link for changing password ",
        });

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
    const _id = req.query._id;
    const { newpassWord } = req.body;
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

const deleteController = async (req, res) => {
  const _id = req.query._id;
  const { password } = req.body;
  try {
    const isUser = await User.findById(_id);

    const verifyPass = bcrypt.compare(password, isUser.password);
    if (verifyPass) {
      await User.deleteOne({ _id });
      res.json({ mesaage: "your account has been sent for deletion " });
    } else {
      res.json({ mesaage: "something went Wrong " });
    }
  } catch (error) {
    console.log(error);
  }
};


const followUserHandler = async (req , res) =>{

//home work 

}


module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotpassController,
  changepassController,
  deleteController,
  followUserHandler
};
