const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const signupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  type:{
    type: String,
  },
  images: {
    type: String,
    // required: true,
  },
});

signupSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

const signup = new mongoose.model("Usersignupform", signupSchema);
module.exports = signup;
