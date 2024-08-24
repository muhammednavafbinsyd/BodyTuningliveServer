const mongoose  = require('mongoose');

const blogschema  = new mongoose.Schema({
    image:{
        type:String,
        required:true,
    },
    title:{
       type:String,
       required:true,               
    },
    description:{
        type:String,
        required:true,

    },
    
});

const data = new mongoose.model("blog",blogschema);

module.exports = data;

