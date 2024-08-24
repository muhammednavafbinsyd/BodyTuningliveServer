const asyncHandler = require("express-async-handler");
const contactModel = require("../model/contactmodel");
const nodemailer = require("nodemailer");

exports.messageSending = asyncHandler(async (req, res) => {
  const { name, email, msg } = req.body;
  try {
    const data = await contactModel.create({
      name: name,
      email: email,
      msg: msg,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "muhnavaf2228@gmail.com",
        pass: "ymomjavuuosyknpg",
      },
    });

    const mailOptions = {
      from: "navafnaz555@gmail.com",
      to: "muhnavaf2228@gmail.com",
      subject: "New Message Received",
      text: `You have received a new message from ${name} (${email}):\n\n${msg}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      console.log("Email sent: " + info.response);
      res.json(data);
    });
  } catch (err) {
    console.log(err);
  }
});
