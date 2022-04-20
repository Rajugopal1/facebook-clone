const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// require('dotenv').config();

function userAuth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(403).send({ message: "Forbiden" });
  try {
    const tokenBody = token.slice(7);
    const decode = jwt.verify(tokenBody, "JWT_PRIVATE_KEY");

    req.user = decode;
    // req.body._id=decode._id;
    next();
  } catch (error) {
    return res.status(400).send({ message: "Invalid token" });
  }
}

function isLogin(req, res, next) {
  if (!req.user.isLogin)
    return res.status(401).send({ message: "Access Denied" });
  next();
}

function verifyRoles(...roles) {
  return async (req, res, next) => {
    userData = await User.findOne({ _id: req.user._id });
    if (!roles.includes(userData.role)) {
      return res.send({ message: "Access Rejected" });
    }
    next();
  };
}


module.exports.userAuth = userAuth;
module.exports.isLogin = isLogin;
module.exports.verifyRoles = verifyRoles;
