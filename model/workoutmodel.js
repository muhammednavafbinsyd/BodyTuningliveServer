const mongoose = require("mongoose");

const workoutschema = new mongoose.Schema({
  trainerId: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  day1:{
    type: String,
    required: true,
  },
  day2: {
    type: String,
    required: true,
  },
  day3: {
    type: String,
    required: true,
  },
  day4: {
    type: String,
    required: true,
  },
  day5: {
    type: String,
    required: true,
  },
  day6: {
    type: String,
    required: true,
  },
  day7: {
    type: String,
    required: true,
  },
});

const workoutplan = new mongoose.model("workoutplan", workoutschema);
module.exports = workoutplan;

