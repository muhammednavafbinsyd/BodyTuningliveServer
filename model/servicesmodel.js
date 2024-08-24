const mongoose = require("mongoose");

const servicemanageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const service = mongoose.model("Service", servicemanageSchema);
module.exports = service;
