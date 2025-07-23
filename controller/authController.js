const User = require('../model/userMode');
const otpModel = require("../model/otpMode");
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

const loginRegister = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const newOtpData = new otpModel({
      otp : hashedOtp,
      userId:user._id,
      expiresAt:Date.now() + 10 * 60 * 1000
    })
    await newOtpData.save();

    await sendEmail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ success:true,message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: error.message });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

   const otpRecord = await otpModel.findOne({ userId: user._id }).sort({ createdAt: -1 });
   // const otpRecord = await otpModel.findOne({ userId: user._id });



    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (Date.now() > otpRecord.expiresAt) {
      await otpModel.deleteMany({ userId: user._id });
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    
    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otp);
    console.log(otp,otpRecord.otp)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Clean all OTPs
    await otpModel.deleteMany({ userId: user._id });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        jiraTokenId: user.jiraTokenId
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



module.exports = {loginRegister,verifyOtp}