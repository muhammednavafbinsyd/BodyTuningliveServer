require("dotenv").config()
const asyncHandler = require("express-async-handler");
const adminModel = require("../model/adminmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const { response } = require("express");
const jwtExpiration = "80d"; // Use "80d" for 80 days
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const OTPModel = require("../model/otpmodel");

exports.createAdmin = asyncHandler(async (req, res) => {
  try {
    const admindata = await adminModel.create({
      Fullname: "Muhammed Nawaf",
      userName: "Nawaf",
      email: "navafnaz555@gmail.com",
      contact: "7560869685",
      password: "nawaf1826",
      Location: "malappuram",
      Role: "CEO / Co-Founder",
      Description:
        "Hi, I’m Muhammed Nawaf , Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
      image: "/images/raan.jpg",
    });

    const result = await admindata.save();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


exports.myadmins = asyncHandler(async (req, res) => {
  const { input1, input2 } = req.body;
  try {
    // Find the admin by email
    const adminData = await adminModel.findOne({ email: input1 });

    if (!adminData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(input2, adminData.password);

    if (passwordMatch) {
      // Password matches, create a payload for user information
      const payload = {
        userId: adminData._id,
        email: adminData.email,
      };

      // Generate a JWT token
      const token = jwt.sign(payload, process.env.SECRECT_KEY,{
        expiresIn: jwtExpiration,
      });

      const AdminProfile = {
        id: adminData._id,
        fullname: adminData.Fullname,
        username: adminData.userName,
        email: adminData.email,
        contact: adminData.contact,
        location: adminData.Location,
        role: adminData.Role,
        description: adminData.Description,
        image: adminData.image,
      };
      res.status(200).json({
        token: token,
        admin: AdminProfile,
      });
      res.json({ token });
    } else {
      res.status(401).json({ invalid: true, message: "Invalid details" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Change password
exports.changePassword = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const AdminChangePassword = await adminModel.findById(userId);
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      AdminChangePassword.password
    );

    if (!passwordMatch) {
      return res
        .status(404)
        .json({ invalid: true, message: "Admin password is incorrect" });
    }

    AdminChangePassword.password = newPassword;
    const updateAdmin = await AdminChangePassword.save();
    res.json(updateAdmin);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error has occurred" });
  }
});
//putADMIN

exports.updateDatas = expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { fullname, username, email, contact, location, role, description } =
    req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    let toUpdate = await adminModel.findById(userId);
    if (imagePath) {
      toUpdate.image = imagePath;
    }
    toUpdate.Fullname = fullname;
    toUpdate.userName = username;
    toUpdate.email = email;
    toUpdate.contact = contact;
    toUpdate.Location = location;
    toUpdate.Role = role;
    toUpdate.Description = description;

    await toUpdate.save();
    const profile = {
      id: toUpdate._id,
      fullname: toUpdate.Fullname,
      location: toUpdate.Location,
      contact: toUpdate.contact,
      email: toUpdate.email,
      image: toUpdate.image,
      username: toUpdate.userName,
      role: toUpdate.Role,
      description: toUpdate.Description,
    };

    res.json({ message: "updated", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Otp controller

exports.otpSend = expressAsyncHandler(async (req, res) => {
  const email = req.body.email;
  try {
    const OTP = otpGenerator.generate(6, { Number: true });
    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
      return res
        .status(404)
        .json({ invalid: true, message: "Admin not found" });
    }
    const otpDocument = await OTPModel.create({
      email: admin.email,
      otp: OTP,
      expiresAt: new Date(Date.now() + 30 * 1000),
    });

    await otpDocument.save();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhnavaf2228@gmail.com",
        pass: "ymomjavuuosyknpg",
      },
    });

    // Define email options
    const mailOptions = {
      from: "muhnavaf2228@gmail.com",
      to: email,
      subject: "Forgot Password OTP",
      text: `Your OTP for resetting the password is: ${OTP}`,
    };

    // Send the email
    transporter.sendMail(mailOptions);

    res.json({ email });
  } catch (error) {
    console.error("Error sending OTP: ", error);
  }
});

exports.otpverify = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  try {
    const otpModel = await OTPModel.findOne({ otp: otp });
    if (!otpModel) {
      return res.status(404).json({ error: "otp not found" });
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
    const YournewPassword = await adminModel.findOne({ email: email });

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

    res
      .status(200)
      .json({ success: "Password updated successfully", updateAdmin });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error has occurred" });
  }
});
