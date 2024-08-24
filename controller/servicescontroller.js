const asyncHandler = require("express-async-handler");
const serviceModel = require("../model/servicesmodel");

exports.serviceCreate = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const image = req.file.filename;

  try {
    const servicedata = await serviceModel.create({
      title: title,
      description: description,
      image: image,
    });
    res.json(servicedata);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.serviceGet = asyncHandler(async (req, res) => {
  try {
    const getData = await serviceModel.find();
    res.json(getData);
  } catch (err) {
    console.log(err);
  }
});

exports.serviceDelation = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const deletedForm = await serviceModel.findByIdAndDelete(id);

    if (deletedForm) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Form not found");
    }
  } catch (err) {
    res.status(500).send("Failed to delete form");
    console.log("Failed to delete form", err);
  }
});

exports.seviceEditGet = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const dataedit = await serviceModel.findById(id);
    res.json(dataedit);
  } catch (err) {
    console.log(err, "erroe an err");
  }
});

exports.serviceUpdate = asyncHandler(async (req, res) => {
  const serviceId = req.params.id;
  const { title, description } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    let toUpdate = await serviceModel.findById(serviceId);

    if (imagePath) {
      toUpdate.image = imagePath;
    }

    toUpdate.title = title;
    toUpdate.description = description;

    let toSave = await toUpdate.save();
    res.json(toSave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
