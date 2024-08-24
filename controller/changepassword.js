
const asyncHandler = require("express-async-handler");
const signupModel = require("../model/signupmodel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const otpmodel = require("../model/otpmodel");


exports.changepassword = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { oldpassword, newpassword, confirmpassword } = req.body;

  try {
    const userchangepassword = await signupModel.findById(userId);
    const passwordmatch = await bcrypt.compare(
      oldpassword,
      userchangepassword.password
    );

    if (!oldpassword) {

      return res.status(400).json({ message: 'Old password is required' });
    } else if (!passwordmatch) {

      return res.status(401).json({ message: 'Invalid old password' });
    } else if (newpassword !== confirmpassword) {
      return res.status(402).json({ message: 'Password mismatch' });
    } else {
      userchangepassword.password = confirmpassword;
      const updateuser = await userchangepassword.save();
      return res.status(200).json(updateuser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while updating' });
  }
});




exports.otpsend = asyncHandler(async (req, res) => {
  const email = req.body.email;
  try {
    // const OTP = otpGenerator.generate(6, { Number: true });
    const OTP = Math.floor((Math.random() *900000 + 100000))
    const userside = await signupModel.findOne({email: email});
    if (!userside) {
      return res.status(400).json({ invalid: true, message: "user not found" });
    }
    const otDoc = await otpmodel.create({
      email: userside.email,
      otp: OTP,
      expiresAt: new Date(Date.now() + 30 * 1000),
    });
    await otDoc.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "navafnaz555@gmail.com",
        pass: "vlgu pbyl xcqr gzmq",
      },
    });
   
    const mailOptions = {
      from: "navafnaz555@gmail.com",
      to: email,
      subject: "Forgot Password OTP",
      text: `Your OTP for resetting the password is: ${OTP}`,


    };
    transporter.sendMail(mailOptions);

    res.json({ email });
  } catch (error) {
    console.error("Error sending OTP: ", error);
  }
});


exports.otpverify = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    try {
      const otpModel = await otpmodel.findOne({ otp: otp });
      if (!otpModel) {
        return res.status(404).json({ error: "otp not found"});
      }
      const currentTime = new Date();
      if (otpModel.expiresAt < currentTime) {
        return res.status(400).json({ error: "OTP has expired" });
      }
      res.status(200).json({ success: "success" });
    } catch (error) {
      console.log("Error verifying OTP: ", error);
    }
  });

  


  exports.setnewpassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmPassword, email } = req.body;

  
    try {
       const YournewPassword = await signupModel.findOne({email:email});
     
    
      if (!YournewPassword) { 
        return res.status(404).json({ message: "error" });
      }
  
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }
      YournewPassword.password = newPassword;
      const updateAdmin = await YournewPassword.save();
        
      res.status(200).json({ success: "Password updated successfully", updateAdmin });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "An error has occurred" });
    }
    
  });
  
