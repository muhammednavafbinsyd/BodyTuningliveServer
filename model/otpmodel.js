// const mongoose = require("mongoose");
// const otpschema = new mongoose.Schema({
//     otp: String,

// })

// 

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required:true,
   },
   otp: String,
    createdAt: {
    expires: 30,
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const otp = new mongoose.model("OTP",otpSchema);
module.exports = otp;




