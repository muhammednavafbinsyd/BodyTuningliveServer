const express = require("express");
const UserToken = require("../middleware/userToken");
const Router = express.Router();
const signupController = require("../controller/signupcontroller");
const passwordotpController = require("../controller/changepassword");
const multer = require("multer");
const trainersController = require("../controller/trainerscontroller");
const workoutcontroller = require("../controller/workoutcontroller");
const dietcontroller = require("../controller/dietplancontroller");
const ServicesController = require("../controller/servicescontroller");
const TestimonialsController = require("../controller/testimonialcontroller");
const SubscribeController = require("../controller/subscriptioncontroller");
const subpackagecontroller = require("../controller/subpackagecontroller");
const plantypeController = require("../controller/plantypecontroll");
const Subscriptionmanage = require("../model/subscriptionmodel");
const userToken = require("../middleware/userToken");
const Blogcontroller = require("../controller/blogcontroller");
const GalleryController = require("../controller/gallerycontroller");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

//signup/crud
Router.post("/signup",signupController.signupform);
Router.get("/getUsers", UserToken, signupController.Getusers);
Router.post("/login", signupController.login);
Router.delete("/userdeletion/:id", signupController.userDelete);
Router.get("/userprofileEdit/:id", signupController.editprofile);
Router.put(
  "/userprofileUpdate/:id",
  upload.single("image"),
  signupController.updateprofile
);
//change password/Otp
Router.post(
  "/changepassword/:id",
  UserToken,
  passwordotpController.changepassword
);
Router.post("/sendotp", passwordotpController.otpsend);
Router.post("/verifyotp", passwordotpController.otpverify);
Router.post("/newpassword",passwordotpController.setnewpassword);

//trainers

Router.get("/trainersget", trainersController.trainersGet);
Router.get("/tarinersedit/:id", trainersController.trainersEdit);

//workouts

Router.get("/workoutplanget/:id", workoutcontroller.getworkoutplan);
Router.get("/getworkoutplanall", workoutcontroller.getworkoutplanall);

//Diets

Router.get("/dietplanget/:id", dietcontroller.getdietplan);
Router.get("/getdietplanall", dietcontroller.getdietplanall);

//services
Router.get("/services", ServicesController.serviceGet);

//Trainers Status

Router.get("/statusOnly", trainersController.onlyStatus);

// Testimonials
Router.get("/testimonialList", TestimonialsController.getTestimonial);

// Subscribe
Router.get("/subscribeList",SubscribeController.getsubscription);

// subscribepackage 
Router.get("/subpacakge/:id",SubscribeController.subsEdit)


// packageId 
Router.get("/packageIdget/:id",subpackagecontroller.forpackageid)

// my subscription list 

Router.get("/mysubscriptionList/:id",subpackagecontroller.listuserallplan)

// 
Router.get("/subpacakge/",SubscribeController.getsubscription)

// getrenewDta
Router.get("/renewdata/:id",subpackagecontroller.getrenewdata)


//Membership
Router.get("/membership",SubscribeController.getsubscription)

//upgrade  
Router.get("/upgrade/:id",SubscribeController.subsEdit)

//current package
// Router.get("/previous/:id",subpackagecontroller.previouspackage)
Router.get("/currentpackage/:id",subpackagecontroller.forViewpackages)

//for package purchase cheking 

Router.get("/packagecheking/:id",subpackagecontroller.listuserstatus)

//for package active or expired cheking

Router.get("/foractiveorexpired",subpackagecontroller.recectstatuscheking)

// for view workouts & Diet Plans 

Router.get("/plantypes",plantypeController.getplantype)
Router.get("/typeGetdiet/:id",dietcontroller.getdiettype)
Router.get("/typeGet/:id",workoutcontroller.getworkouttype)

// blogs

Router.get("/blogs",Blogcontroller.getblog)
Router.get("/blogdetails/:title",Blogcontroller.getblogview)


//  for each trainer each workout plan show 
Router.get("/trainerworkoutplan/:id",workoutcontroller.getworkoutplan);
Router.get("/trainerworkoutplanview/:id",workoutcontroller.editgetworkoutplan);

//  for each trainer each diet plan show 

Router.get("/trainerdietplan/:id",dietcontroller.getdietplan)
Router.get("/trainerdietplanview/:id",dietcontroller.editgetdietplan)

// Gallery 
Router.get("/allgallery",GalleryController.galleryGet)


// razorpay  

Router.post("/order",subpackagecontroller.makeorder)




module.exports = Router;
