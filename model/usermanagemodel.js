const mongoose = require('mongoose');

const usermanageSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type:String, // or File or another appropriate type
    required: true,
  },
  
});

const usermanage = mongoose.model('usermanage', usermanageSchema);

module.exports = usermanage;
