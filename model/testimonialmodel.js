const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema ({

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
    }

})

const testimonial =  mongoose.model("Testimonial",testimonialSchema)
module.exports = testimonial