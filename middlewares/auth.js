const jwt = require("jsonwebtoken");

const IsAuthenticated = async (req, res, next) => {
  try {
    const {token} = req.headers;
    // const secretKey = process.env.SECRET_KEY;

    if (!token) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      await jwt.verify(token, "sevensprings", (err, decode) => {
        if (err) {
          res.status(401).json({ message: "Unauthorized" });
        } else {


          req.info= decode;


      
          return next();
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = IsAuthenticated;
