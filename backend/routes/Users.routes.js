// backend/routes/Users.routes.js (Enhanced with Google OAuth)
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import OTP from "../models/otp.js";
import auth from "../middleware/auth.js";
import { generateOTP, sendOTPEmail } from "../utils/emailService.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const key = process.env.JWT_SECRET;

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// GOOGLE OAUTH ROUTES
// ==========================================

// Google Sign In/Sign Up
router.post("/google-auth", async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: "Google credential is required",
    });
  }

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - sign in
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture;
        await user.save();
      }
    } else {
      // New user - sign up
      // For Google auth, we don't need password
      // Generate a random password hash (user won't use it)
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(5);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = new User({
        username: name,
        email,
        passwordHash,
        googleId,
        profilePicture: picture,
        isEmailVerified: true, // Google already verified email
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      success: true,
      message:
        user.googleId === googleId && !user.profilePicture
          ? "Signed up successfully"
          : "Signed in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(400).json({
      success: false,
      message: "Invalid Google token or authentication failed",
    });
  }
});

// ==========================================
// EMAIL OTP ROUTES
// ==========================================

// Request OTP for signup
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists!",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({ email, otp });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    console.error("Error in request-otp:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Verify OTP and complete signup
router.post("/signup", async (req, res) => {
  const { username, email, password, otp } = req.body;

  if (!username || !email || !password || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide all values including OTP!",
    });
  }

  try {
    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(5);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      passwordHash,
      isEmailVerified: true,
    });
    await newUser.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
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

// ==========================================
// REGULAR LOGIN
// ==========================================

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
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if user signed up with Google
    if (user.googleId && !user.passwordHash) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please use 'Sign in with Google' button.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
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
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ==========================================
// OTHER ROUTES (unchanged)
// ==========================================

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
