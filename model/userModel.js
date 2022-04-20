const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");
const UsrSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String },
    phoneNumber: { type: Number },
    role: { type: String, required: true },
    image: { type: String },
    active: {
        type: Boolean,
        default: false,
      },
    socketId: {
      type: String,
      default: "",
    },
    friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

UsrSchema.methods.generateAuthToken = function () {
  return jwtToken.sign(
    { _id: this._id, email: this.email, isLogin: true },
    "JWT_PRIVATE_KEY",
    {
      expiresIn: "10h",
    }
  );
};

UsrSchema.statics.createPassword = (password) => {
  return bcrypt.hash(password, 10);
};

UsrSchema.statics.passwordCompare = (plainPassword, hashPassword) => {
  return bcrypt.compare(plainPassword, hashPassword);
};

module.exports = mongoose.model("User", UsrSchema);
