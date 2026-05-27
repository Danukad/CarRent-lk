const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
const nodemailer = require("nodemailer");
const OTP = require("../models/OTP");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, companyName, phone, address, otp } =
      req.body;

    // Verify OTP code
    const record = await OTP.findOne({ email });
    if (!record || record.otp !== otp) {
      return res.status(400).json({ msg: "Invalid or expired OTP code!" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password, role: role || "renter" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // If registering as a company, create the Company profile too
    let companyData = null;
    if (role === "company") {
      if (!companyName) {
        await User.findByIdAndDelete(user._id);
        return res
          .status(400)
          .json({ msg: "Company name is required for company accounts" });
      }
      const company = new Company({
        user: user._id,
        companyName,
        contactEmail: email,
        phone: phone || "",
        address: address || "",
      });
      await company.save();
      companyData = { id: company._id, companyName: company.companyName };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { id: user._id, name, email, role: user.role },
      company: companyData,
    });

    // Remove OTP record after successful registration
    try {
      await OTP.deleteOne({ email });
    } catch (err) {
      console.warn("Failed to delete OTP record:", err.message);
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server Error");
  }
});

// Create mail transporter using SMTP settings from env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  // Port 587 uses STARTTLS (secure: false), Port 465 uses implicit TLS (secure: true)
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Optional: Add logging for debugging
  logger: false, // Set to true to see SMTP debug logs
  debug: false, // Set to true to see detailed SMTP communication
});

// Send Verification OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });
    // Optional: Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });
    // Generate a cryptographically secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save or update existing OTP in database
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true },
    );
    // Send Email
    const mailOptions = {
      from: `"CarRents.lk" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your CarRents.lk Account",
      html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <h2 style="color: #7C3AED; text-align: center;">Welcome to CarRents.lk</h2>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5;">Please use the following 6-digit verification code to complete your signup process. This code will expire in 5 minutes:</p>
                    <div style="background: #F5F3FF; border: 1.5px dashed #7C3AED; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #7C3AED;">${otp}</span>
                    </div>
                    <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
                </div>
            `,
    };
    await transporter.sendMail(mailOptions);
    res.json({ msg: "Verification OTP sent to your email." });
  } catch (err) {
    console.error("OTP Send Error:", err);
    const message =
      err && err.code === "EAUTH"
        ? "SMTP login failed. Check EMAIL_USER and EMAIL_PASS in .env (Gmail app password required)."
        : "Failed to send verification email.";
    res.status(500).json({ msg: message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // If company, fetch company id too
    let companyData = null;
    if (user.role === "company") {
      const company = await Company.findOne({ user: user._id }).select(
        "_id companyName logo",
      );
      if (company)
        companyData = {
          id: company._id,
          companyName: company.companyName,
          logo: company.logo,
        };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: companyData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server Error");
  }
});

// Firebase Login Route
router.post("/firebase-login", async (req, res) => {
  try {
    const { name, email, firebaseId } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        firebaseId,
        role: "renter",
        password: "firebase_user",
      });
      await user.save();
    } else {
      // Update firebaseId if user exists
      if (!user.firebaseId) {
        user.firebaseId = firebaseId;
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name, email, role: user.role },
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ msg: "Firebase authentication failed" });
  }
});

// Update User Profile
router.post("/update-profile", async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ msg: "User ID and name are required" });
    }

    // Find user and update name
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
});

module.exports = router;
