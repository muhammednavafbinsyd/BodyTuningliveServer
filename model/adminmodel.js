const mongoose =require ("mongoose");
const bcrypt = require ("bcrypt");

const adminSchema = new mongoose.Schema({
    Fullname:{
    type:String,
    required:true,
   },
    userName:{
        type: String,
        required: true,

    },
    email:{
        type: String,
        required: true,
    },
    contact:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    Location:{
        type: String,
        required:true
    },
    Role:{
        type:String,
        required: true
    },
    Description:{
        type:String,
        required: true
    },
    image:{
        type: String,
        required:true
    },
   
    
    
})

adminSchema.pre('save', async function(next) {
    try {
        
        if (!this.isModified('password')) {
            return next();
        }

  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        
        this.password = hashedPassword;

        next();
    } catch (error) {
        return next(error);
  }
});


const admin = new mongoose.model('Admin', adminSchema);
module.exports = admin;



