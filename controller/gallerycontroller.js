const asyncHandler = require("express-async-handler");
const galleryModel = require("../model/gallerymodel");

exports.galleryCreate = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const image = req.file.filename;

  try {
    const data = await galleryModel.create({
      category: category,
      image: image,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

exports.galleryGet = asyncHandler(async (req, res) => {
  try {
    const data = await galleryModel.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

exports.galleryedit = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await galleryModel.findById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});



exports.deletegallery = asyncHandler(async(req,res)=>{

  const id =req.params.id;
  try{

    const data =  await galleryModel.findByIdAndDelete(id);
    if (data) {
      res.send("successfully deleted");
    } else {
      res.status(404).send("failed deleting");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }

})











exports.galleryUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { category } = req.body;
  const imagePath = req.file ? req.file.filename : null;

  try {
    if (!category) {
      return res.status(400).json({ error: " category are required " });
    }

    let toUpdate = await galleryModel.findById(id);

    if (imagePath) {
      toUpdate.image = imagePath;
    }

    toUpdate.category = category;

    let toSave = await toUpdate.save();
    res.json(toSave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
