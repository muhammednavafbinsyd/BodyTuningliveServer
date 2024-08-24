const mongoose = require('mongoose');

const typescheam = new mongoose.Schema({
    type:{
        type:String,
        required:true,
    }
})

const plantype = new mongoose.model("plantype",typescheam)
module.exports = plantype