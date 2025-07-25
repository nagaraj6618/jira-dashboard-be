const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
   userId:String,
   otp:{
      type:String
   },
   createdAt :Date,
   expiresAt:Date
},{timestamps:true})

module.exports = mongoose.model('userOTPVerification',OTPSchema);