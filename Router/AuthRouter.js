const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../Model/UserModel");
const userValidation = require("../validation/userValidation");
const genrateToken = require("../utills/genratetoken");

// SIGNUP
router.post("/signup", async (req, res, next) => {
  try {
    const { error } = userValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Enter the data correctly",
      });
    }

    const { name, email, password } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashpassword,
    });

    await user.save();

    const token = genrateToken(user._id);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = genrateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;