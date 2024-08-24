const asyncHandler = require("express-async-handler");
const signupModel = require("../model/signupmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler")
const jwtExpiration = "80d";

exports.signupform = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    phonenumber,
    password,
    location,
    city,
    pin,
    country,
    type,
  } = req.body;
  try {
    const existinguser = await signupModel.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ invalid: true, message: "email already exists" });
    }

    const signuData = await signupModel.create({
      username: username,
      email: email,
      phonenumber: phonenumber,
      password: password,
      location: location,
      city: city,
      pin: pin,
      country: country,
      type: type,
    });
    res.json(signuData);
  } catch (err) {
    console.log(err);
  }
});

exports.login = asyncHandler(async (req, res) => {
  const { input1, input2 } = req.body;
  try {
    const userdata = await signupModel.findOne({ email: input1 });

    if (!userdata) {
      return res.status(404).json({ error: "user not found" });
    }
    const passwordMatch = await bcrypt.compare(input2, userdata.password);

    if (passwordMatch) {
      const payload = {
        userId: userdata._id,
        email: userdata._email,
      };

      const token = jwt.sign(payload, process.env.SECRECT_KEY,{
        expiresIn: jwtExpiration,
      });
      const userProfile = {
        id: userdata._id,
        username: userdata.username,
        email: userdata.email,
        phonenumber: userdata.phonenumber,
        // password:userdata.password,
        location: userdata.location,
        city: userdata.city,
        pin: userdata.pin,
        country: userdata.country,
        image: userdata.images,
      };
      res.status(200).json({
        usertoken: token,
        user: userProfile,
      });
    } else {
      res.status(401).json({ invalid: true, message: "invalid details" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});
exports.Getusers = asyncHandler(async (req, res) => {
  const subscription = req.query.subscribefilter || "";

  const page = parseInt(req.query.page);
  const pagesize = parseInt(req.query.limit);

  const skip = (page - 1) * pagesize;

  try {
    const query = {};

    if (subscription) {
      query.type = subscription;
    }
    const totalitems = await signupModel.countDocuments(query);
    const totalpages = Math.ceil(totalitems / pagesize);

    const getUsers = await signupModel
      .find(query)
      .skip(skip)
      .limit(pagesize)
      .exec();

    res.json({ getUsers, totalpages ,totalitems});
  } catch (err) {
    console.log(err, "error get usersdataaaaaa");
  }
});

exports.editprofile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const editdatas = await signupModel.findById(id);
    res.json(editdatas);
  } catch (err) {
    console.log(err, "error edit datas");
  }
});

exports.userDelete = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deletesigned = await signupModel.findByIdAndDelete(id);
    if (deletesigned) {
      res.send("successfully deleted");
    } else {
      res.status(404).send("user deletion failed");
    }
  } catch (err) {
    res.status(500).send("failed to delete user");
    console.log("user deletion failed", err);
  }
});

exports.updateprofile = expressAsyncHandler(async (req, res) => {
  const userId = req.params.id;

  const { username, email, phonenumber, location, country, pin } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const existinguser = await signupModel.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ invalid: true, message: "email already exists" });
    }

    let toUpdate = await signupModel.findById(userId);
    if (imagePath) {
      toUpdate.images = imagePath;
    }
    toUpdate.username = username;
    toUpdate.email = email;
    toUpdate.phonenumber = phonenumber;
    toUpdate.location = location;
    toUpdate.country = country;
    toUpdate.pin = pin;

    await toUpdate.save();
    const userProfile = {
      id: toUpdate._id,
      username: toUpdate.username,
      email: toUpdate.email,
      phonenumber: toUpdate.phonenumber,
      location: toUpdate.location,
      country: toUpdate.country,
      pin: toUpdate.pin,
      image: toUpdate.images,
    };
    res.json({ message: "updated", userProfile: userProfile, toUpdate });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server  error" });
  }
});
