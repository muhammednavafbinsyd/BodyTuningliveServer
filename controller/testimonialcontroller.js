const asyncHandler = require("express-async-handler");
const testimonialModel = require("../model/testimonialmodel");

exports.createTestimonial = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const image = req.file.filename;

  try {
    const data = await testimonialModel.create({
      title: title,
      description: description,
      image: image,
    });
    res.json(data);
  } catch (err) {
    console.log(err, "failed to create");
    res.status(500).send({ message: "internal server error" });
  }
});

exports.getTestimonial = asyncHandler(async (req, res) => {
  try {
    const data = await testimonialModel.find();
    res.json(data);
  } catch (err) {
    console.log(err, "failed to find");
    res.status(500).send({ message: "internal server error" });
  }
});

exports.DeleteTestimonial = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await testimonialModel.findByIdAndDelete(id);
    if (data) {
      res.send("successfully deleted");
    } else {
      res.status(404).send("failed deleting");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
});

exports.getoneTestimonialforEdit = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await testimonialModel.findById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
});

exports.UpdateTestimonial = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const { title, description } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    let toUpdate = await testimonialModel.findByIdAndUpdate(id);
    if (imagePath) {
      toUpdate.imagePath = imagePath;
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
