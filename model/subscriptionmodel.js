const mongoose = require('mongoose');

const subcrptionSchema = new mongoose.Schema({
    membershiptype:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    monthlyfee:{
        type:String,
        required:true
    },
    onetimeentrollmentfee:{
        type:String,
        required:true
    },
    additionalbenefits:{
        type:String,
        required:true
    }
})
const Subscriptionmanage = mongoose.model('Subscriptionmanage',subcrptionSchema);
module.exports = Subscriptionmanage;