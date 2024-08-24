const mongoose = require("mongoose");

const galleryschema = new mongoose.Schema({
  image: [
    {
      type: String,

      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
  },
});

const galleryData =  new mongoose.model("Gallery",galleryschema)
module.exports = galleryData;