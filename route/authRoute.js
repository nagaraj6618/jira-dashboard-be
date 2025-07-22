const express = require("express");
const { loginRegister, verifyOtp } = require("../controller/authController");

const router = express.Router();

router.post('/login',loginRegister);
router.post('/verify-otp',verifyOtp);


module.exports = router;