const asyncHandler = require("express-async-handler");
const userModel = require("../model/usermanagemodel.js");
const adminModel = require("../model/adminmodel.js");

// postData

exports.createUser = asyncHandler(async (req, res) => {
  const { userName, email, phoneNumber, password } = req.body;
  const image = req.file.path;

  try {
    const existinguser = await userModel.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ invalid: true, message: "Email already exist" });
    }

    const userData = await userModel.create({
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      image: image,
    });
    res.json(userData);
  } catch (err) {
    console.log(err);
  }
});

//getUsers data
exports.getList = asyncHandler(async (req, res) => {
  try {
    const elements = await userModel.find();
    res.json(elements);
  } catch (error) {
    res.status(500).send("Failed to list forms");
    console.log("Failed to list forms", error);
  }
});

// delete data

exports.deleteList = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deletedForm = await userModel.findByIdAndDelete(id);
    if (deletedForm) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete form");
    console.log("Failed to delete form", error);
  }
});

// edit data
exports.editData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const editId = await userModel.findById(id);
    if (!editId) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(editId);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.updateData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userName, email, phoneNumber, password } = req.body;
  let image = req.file ? req.file.path : undefined;

  try {
    const existinguser = await userModel.findOne({ email });
    const adminExist = await adminModel.findOne({ email });
    if (
      (existinguser && existinguser._id.toString() !== id) ||
      (adminExist && adminExist._id.toString() !== id)
    ) {
      return res
        .status(400)
        .json({ invalid: true, message: "Email already exist" });
    }
    const currentUser = await userModel.findById(id);
    if (!image) {
      image = currentUser.image;
    }

    const updateElement = await userModel.findByIdAndUpdate(
      id,
      { userName, email, phoneNumber, password, image },
      { new: true }
    );

    if (updateElement) {
      res.send("successfully updated");
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update form");
    console.log("Failed to update form", error);
  }
});
