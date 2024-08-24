const mongoose = require("mongoose");

const trainersSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  type:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});
const trainer = new mongoose.model("Trainer", trainersSchema);
module.exports = trainer;
