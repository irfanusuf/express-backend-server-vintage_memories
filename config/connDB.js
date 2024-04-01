const mongoose = require("mongoose"); // importing mongoose libarary which is used for connecting mongo db
require("dotenv").config();
// connecting with  mongo db by using mongoose
const url = process.env.MONGO_URL
const connectDb = async () => {
  try {
    await mongoose.connect(url);
    console.log(`Db Connected on ${url}`);
  } catch (err) {
    console.log(err);
  }
};


module.exports = connectDb
