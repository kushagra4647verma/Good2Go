import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/User.js";
import auth from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();
const key = process.env.JWT_SECRET;

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all values!",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, passwordHash });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    console.error("Error in Creating User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password!",
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const userInfo = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: userInfo });
  } catch (error) {
    console.log("Error in fetching User details: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/save/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Place Invalid!" });
  }
  try {
    const obj = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedPlaces: id } },
      { new: true }
    );
    if (!obj) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    console.log("Error in saving place: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.delete("/save/:id", auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Place Invalid!" });
  }
  try {
    const obj = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { savedPlaces: id },
      },
      { new: true }
    );
    if (!obj) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: obj,
    });
  } catch (error) {
    console.error("Error removing saved place:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/saved", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedPlaces");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user.savedPlaces,
    });
  } catch (error) {
    console.error("Error fetching saved places:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
