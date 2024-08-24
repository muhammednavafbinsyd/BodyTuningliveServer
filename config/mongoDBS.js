require("dotenv").config()
const mongoose = require("mongoose");
//  MongoDBS Local 

// function connectDB() {
//   mongoose.connect('mongodb://0.0.0.0:27017/bodytuning',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Database connected");
//     console.log("http://localhost:27017");
//   })
//   .catch((err) => {
//     console.log("Database error: " + err);
//   });
// }

// Mongo Atals

function connectDB() {
  mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Atlas Database connected");
  })
  .catch((err) => {
    console.log("Database error: " + err);
  });
}

module.exports = connectDB;


