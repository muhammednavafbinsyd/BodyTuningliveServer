const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  paymentId:{
    type:String,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  packageId: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },  
  username: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  monthlyfee: {
    type: String,
    required: true,
  },
  onetimeentrollmentfee: {
    type: String,
    required: true,
  },
  previous:{
    type: String,
  },
  totalpaid: {
    type: Number,
    required: true,
  },
  status:{
    type: String,
  },
  type:{
    type:String,
  },
  balanceAmount:{
    type:String
  }

});



const package = new mongoose.model("subscribedusers", packageSchema);
module.exports = package;
