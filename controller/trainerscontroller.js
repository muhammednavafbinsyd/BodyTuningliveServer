const asyncHandler = require("express-async-handler");
const trainersModel = require("../model/trainersmodel");
const userModel = require("../model/usermanagemodel.js");
const adminModel = require("../model/adminmodel.js");
const workoutmodel = require("../model/workoutmodel");
const dietmodel = require("../model/dietmodel");
// const packageModel = require("../model/subpackagemodel")

// Trainers post-processing

exports.createTrainers = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, contact, description, status, type } =
    req.body;
  const image = req.files.map((file) => file.path);
  try {
    const existingtrainer = await trainersModel.findOne({ email });
    if (existingtrainer) {
      return res
        .status(400)
        .json({ invalid: true, message: "Email already exist" });
    }

    const trainerdata = await trainersModel.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      contact: contact,
      description: description,
      image: image,
      status: status,
      type: type,
    });
    res.json(trainerdata);
  } catch (err) {
    console.log(err);
  }
});

// Trainers get-processing

exports.trainersGet = asyncHandler(async (req, res) => {
  const plantype = req.query.plantypes;

  try {
    const query = {};

    if (plantype) {
      query.type = plantype;
    }

    const elements = await trainersModel.find(query);
    res.json(elements);
  } catch (err) {
    res.status(500).send("Failed getting elements");
    console.log("error-trainers get", err);
  }
});

// Trainers edit-
exports.trainersEdit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const editId = await trainersModel.findById(id);
    if (!editId) {
      return res.status(404).json({ error: "trainer not found" });
    }
    res.json(editId);
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Trainers Update

exports.trainersUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, contact, description, status, type } =
    req.body;
  let image = req.files.map((file) => file.path);

  try {
    const existinguser = await userModel.findOne({ email });
    const adminExist = await adminModel.findOne({ email });
    const trainerExist = await trainersModel.findOne({ email });
    if (
      (existinguser && existinguser._id.toString() !== id) ||
      (adminExist && adminExist._id.toString() !== id) ||
      (trainerExist && trainerExist._id.toString() !== id)
    ) {
      return res
        .status(400)
        .json({ invalid: true, message: "Email already exist" });
    }
    const currentUser = await trainersModel.findById(id);

    if (!image || image.length === 0) {
      image = currentUser.image;
    }

    const updateElement = await trainersModel.findByIdAndUpdate(
      id,
      { firstname, lastname, email, contact, description, image, status, type }, // Include image in the update
      { new: true }
    );

    if (updateElement) {
      res.send("successfully updated");
    } else {
      res.status(404).send("Trainer not found");
    }
  } catch (error) {
    res.status(500).send("Failed to update form");
    console.log("Failed to update Trainer form", error);
  }
});

// Trainers delete

exports.deleteTrainers = asyncHandler(async (req, res) => {
  const id = req.params.id;
  {
    trainerId: id;
  }
  try {
    const deleteTrainersData = await trainersModel.findByIdAndDelete(id);
    await workoutmodel.deleteMany({ trainerId: id });
    await dietmodel.deleteMany({ trainerId: id });

    if (deleteTrainersData) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    res.status(500).send("Failed to delete form");
    console.log("Failed to delete form", error);
  }
});

//status update

exports.updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updateElement = await trainersModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (updateElement) {
      res.send("successfull");
    } else {
      res.status(404).send("failed");
    }
  } catch (error) {
    res.status(500).send("Failed to update status");
    console.log("Failed to update status", error);
  }
});

exports.onlyStatus = asyncHandler(async (req, res) => {
  try {
    const result = await trainersModel.find({ status: "Active" });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.trainersCount =  asyncHandler(async(req,res)=>{
  try{
    const result =  await trainersModel.countDocuments();
    res.json(result);
  }catch (error) {
    console.log(error);
  }
})



