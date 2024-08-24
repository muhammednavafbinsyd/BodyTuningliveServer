const blogmodel = require("../model/blogmodel");
const asyncHandler = require("express-async-handler");


exports.createblog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const image = req.file.filename;

  try {
    const data = await blogmodel.create({
      title: title,
      description: description,
      image: image,
    });
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

exports.getblog = asyncHandler(async (req, res) => {
  try {
    const data = await blogmodel.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  } 
});
exports.getblogforedit = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await blogmodel.findById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

exports.getblogview = asyncHandler(async (req, res) => {
  const title = req.params.title;
  try {
    const data = await blogmodel.findOne({title: title});
    console.log(data,"heloo");
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

exports.bolgdelete = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await blogmodel.findByIdAndDelete(id);
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


exports.updateblog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const imagePath = req.file ? req.file.filename: null;
  const blogId = req.params.id;

  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    let toUpdate = await blogmodel.findById(blogId);

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
