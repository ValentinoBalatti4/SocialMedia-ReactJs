const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = ({ id, username }) => {
  return jwt.sign({ id, username }, process.env.JWT_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user){ 
        req.user = user;
        return res.json({ status: true, user: user.username })
      }
      else return res.json({ status: false })
    }
  })
}

module.exports.userLogged = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false , message: "User not logged in!"});
  }
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(data.id);

    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    console.error("Error during user verification:", error);
    return res.status(500).json({ status: false, message: "An error occurred during user verification" });
  }
}