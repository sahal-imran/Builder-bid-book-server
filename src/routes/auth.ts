import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { LogError, LogSuccess } from "../utils/Log";

// Instances
const router = express.Router();

// Sign up
router.post("/signup", async (req, res) => {
  try {
    //1)  Destructuring req.body to get all the data fields
    const {
      firstName,
      lastName,
      role,
      email,
      companyName,
      companyPhone,
      csiDivision,
      state,
      country,
      password,
    } = req.body;

    // 2) Creteing new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role,
      companyName,
      companyPhone,
      csiDivision,
      state,
      country,
      password,
    });

    // 3) Sending response to the client
    res.status(201).json({
      status: "success",
      message: "User created successfully.",
      data: {
        user: newUser,
      },
    });

    LogSuccess("Path", __dirname);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Failed to create user.",
    });

    LogError("Path", __dirname);
  }
});

// Sign up
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if the email exists (check if user exists )

    const user = await User.findOne({ email: email }).select("+password");

    //2) Show error message if user does not exists or if password is invalid
    if (!user || !(await user.comparePassword(password, user.password))) {
      throw new Error("Please enter a valid email and password!");
    }

    // 3) Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 4) Send the token as an HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
    });

    // 5) Sending response to the client
    res.status(200).json({
      status: "success",
      token,
      message: "User logged in successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
});

export default router;
