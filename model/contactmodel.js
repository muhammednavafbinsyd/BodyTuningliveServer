const mongoose = require('mongoose')


const sendmsg = new mongoose.Schema({

name:{
    type: String,
    required: true,

},
email:{
    type: String,
    required: true,
},
msg:{
    type:String,
    required: true,
}

} )

const message = new mongoose.model("UserMessage",sendmsg)

module.exports = message;
