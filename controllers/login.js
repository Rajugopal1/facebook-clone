const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");

module.exports = {
  async userLogin(req, res) {
    await check("email")
      .notEmpty()
      .withMessage("email is not provide")
      .run(req);
    await check("password")
      .notEmpty()
      .withMessage("password is not provide")
      .run(req);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).send(errors);
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).send("Invalid email or password");
      const isAuthUser = await User.passwordCompare(password, user.password);
      if (!isAuthUser) return res.status(401).send("Invalid email or password");
      const token = await user.generateAuthToken();
      res.send({ user: user, token: token });
    } catch (error) {
      res
        .status(400)
        .send(`The user is not register because of this error ${error}`);
    }
  },
//   async userLogout(req, res) {
//     let sess = req.user;

//     try {
//       let token = req.header("Authorization");
//       sess = null;
//       await new Promise(jwtr.destroy(token));
//       return res.send({ success: true, message: "user logout successfully" });
//     } catch (error) {
//       return res.status(400).send({ message: error.message });
//     }
//   },
  async changePassword(req, res) {
    await check("oldPassword")
      .notEmpty()
      .withMessage("oldPassword is not provide")
      .run(req);
    await check("newPassword")
      .notEmpty()
      .withMessage("newPassword is not provide")
      .run(req);
    await check("confirmPassword")
      .notEmpty()
      .withMessage("confirmPassword is not provide")
      .run(req);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).send(errors);
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findOne({ _id: req.user._id });
      if (!user) return res.status(401).send("Invalid email or password");
      const isAuthUser = await User.passwordCompare(oldPassword, user.password);
      if (!isAuthUser) return res.status(401).send("Invalid email or password");
      if (newPassword !== confirmPassword)
        return res
          .status(400)
          .send("Password and confirmPassword does not match");
      user.password = await User.createPassword(newPassword);
      await user.save();
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async resetPassword(req, res) {
    await check("email")
      .notEmpty()
      .withMessage("email is not provide")
      .run(req);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).send(errors);
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(401).send("Invalid email");
      return res.status(200).send(user);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async updatePassword(req, res) {
    await check("email")
      .notEmpty()
      .withMessage("email is not provide")
      .run(req);
    await check("newPassword")
      .notEmpty()
      .withMessage("newPassword is not provide")
      .run(req);
    await check("confirmPassword")
      .notEmpty()
      .withMessage("confirmPassword is not provide")
      .run(req);

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).send(errors);
      const { email, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword)
        return res
          .status(400)
          .send("Password and confirmPassword does not match");
      const user = await User.findOne({ email: email });
      if (!user) return res.status(401).send("Invalid email or password");
      user.password = await User.createPassword(newPassword);
      await user.save();
      return res.send(user);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
};
