const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-deletes in 5 minutes (300s)
});

module.exports = mongoose.model("OTP", OTPSchema);
