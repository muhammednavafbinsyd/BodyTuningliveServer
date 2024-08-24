const asyncHandler = require("express-async-handler");
const plantypeModel = require("../model/plantypemodel");

exports.createplantype = asyncHandler(async (req, res) => {
  const { type } = req.body;

  try {
    const data = await plantypeModel.create({
      type: type,
    });
    res.json(data);
  } catch (err) {
    console.log(err, "failed to create");
    res.status(500).send({ message: "internal server error" });
  }
});

exports.getplantype = asyncHandler(async (req, res) => {
  try {
    const data = await plantypeModel.find();
    res.json(data);
  } catch (err) {
    console.log(err, "failed to find");
    res.status(500).send({ message: "internal server error" });
  }
});

exports.Deleteplantype = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await plantypeModel.findByIdAndDelete(id);
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

exports.getplantyepforEdit = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await plantypeModel.findById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
});

exports.UpdatePlantype = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { type } = req.body;

  try {
    if (!type) {
      return res.status(400).json({ error: "Type is required." });
    }

    let toUpdate = await plantypeModel.findByIdAndUpdate(id);

    if (!toUpdate) {
      return res.status(404).json({ error: "Plan type not found." });
    }

    toUpdate.type = type;

    let toSave = await toUpdate.save();
    res.json(toSave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
