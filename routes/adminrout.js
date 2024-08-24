const express = require('express');
const  VerifyToken =require("../middleware/verifyToken");
const Router = express.Router();
const myAdmin  = require("../controller/admincontroll");
const UserController = require('../controller/usermanagecontroll');
const subcrptionController = require("../controller/subscriptioncontroller");
const trainersController = require("../controller/trainerscontroller");
const workoutcontroller = require("../controller/workoutcontroller");
const dietcontroller = require("../controller/dietplancontroller");
const ServicesController = require("../controller/servicescontroller");
const TestimonialController = require("../controller/testimonialcontroller");
const multer = require('multer');
const admin = require('../model/adminmodel');
const verifyToken = require('../middleware/verifyToken');
const SubpackageController = require("../controller/subpackagecontroller");
const signupController = require("../controller/signupcontroller");
const contactController = require("../controller/contactcontroller")
const plantypeController = require("../controller/plantypecontroll")
const Blogcontroller = require("../controller/blogcontroller")
const GalleryController = require("../controller/gallerycontroller")
const GraphController = require("../controller/graphcontroller")

// const upload = multer({ dest: 'public/uploads' });
const uploadquill = multer({
  limits: { fieldSize: 10 * 1024 * 1024 }, // 10MB limit for field size
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  var upload = multer({ storage: storage });


  const storageq = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/quill'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); 
    },
  });
 
  const uploadq = multer({ storage: storageq });
/// AdminEngine
//  Router.post('/',myAdmin.createAdmin)
 Router.post('/admin',myAdmin.myadmins); 
 Router.post('/ChangePassword/:id',VerifyToken, myAdmin.changePassword);
 Router.put('/adminUpdateData/:id',VerifyToken,upload.single('image'),myAdmin.updateDatas);
 Router.post("/sendotp", myAdmin.otpSend);
 Router.post("/verifyotp", myAdmin.otpverify);
 Router.post("/newpassword",myAdmin.setnewpassword);
//UserEngine
Router.post('/userPost',VerifyToken,upload.single('image'), UserController.createUser)
Router.get('/userget',VerifyToken, UserController.getList)
Router.delete('/userdelete/:id',VerifyToken,UserController.deleteList,);
Router.get('/userEdit/:id',VerifyToken, UserController.editData);
// Router.put('/userUpdate/:id',UserController.updateData);
Router.put('/userUpdate/:id',VerifyToken,upload.single('image'), UserController.updateData);
//SubscriptionEngine
Router.post("/subscriptioncreate",VerifyToken,subcrptionController.CreateSubscription);
Router.get("/getSubscription",VerifyToken,subcrptionController.getsubscription);
Router.delete("/Deletesubscription/:id",VerifyToken,subcrptionController.deleteSubscription);
Router.get("/subscriptionsedit/:id",VerifyToken,subcrptionController.subsEdit);
Router.put("/subscriptionUpdate/:id",VerifyToken,subcrptionController.subsUpdate);
// TrainerEngine
Router.post("/trainerspost",upload.array('image'),trainersController.createTrainers);
Router.get("/trainersget",verifyToken,trainersController.trainersGet);
Router.get("/tarinersedit/:id",verifyToken,trainersController.trainersEdit);
Router.put("/trainersupdate/:id",verifyToken,upload.array('image'),trainersController.trainersUpdate);
Router.delete("/trainersdelete/:id",verifyToken,trainersController.deleteTrainers)
//Status
Router.put("/updateStatus/:id",verifyToken,trainersController.updateStatus)
// WorkoutEngine
// Router.post("/workoutpost",upload.array('image'),workoutcontroller.workoutplan);
Router.post("/workoutpost",workoutcontroller.postworkoutplan);
Router.get("/workoutplanget/:id",verifyToken,workoutcontroller.getworkoutplan);
Router.delete("/deleteWorkoutplan/:id",workoutcontroller.deleteWorkoutPlan);
Router.get("/editworkoutplan/:id",verifyToken,workoutcontroller.editgetworkoutplan );
Router.put("/updateworkoutplan/:id",workoutcontroller.workoutplanUpdate );
// Image upload
Router.post('/tinymceImageUpload',uploadq.single('file'), (req, res) => {
  // Once the file is uploaded, generate the image URL
  const imageUrl = `http://localhost:2000/${req.file.path}`;
  res.json({ location: imageUrl });
});
//DietEngine
Router.post("/dietplanpost",dietcontroller.postdietplan)
Router.get("/dietplanget/:id",dietcontroller.getdietplan)
Router.delete("/deletedietplan/:id",dietcontroller.deletedietPlan)
Router.get("/editdietplan/:id",dietcontroller.editgetdietplan)
Router.put("/updatedietplan/:id",dietcontroller.dietplanUpdate)
// ServicesEngine
Router.post("/servicesPost",upload.single('image'),ServicesController.serviceCreate);
Router.get("/serviceGet",VerifyToken,ServicesController.serviceGet);
Router.delete("/serviceDelete/:id",ServicesController.serviceDelation);
Router.get("/ServiceEdit/:id",verifyToken,ServicesController.seviceEditGet);
Router.put("/serviceUpdate/:id",upload.single('image'),verifyToken,ServicesController.serviceUpdate);
// TestimonialEngine
Router.post("/testimonialPost",upload.single("image"),TestimonialController.createTestimonial);
Router.get("/testimonialList",verifyToken,TestimonialController.getTestimonial);
Router.delete("/deleteTestimonials/:id",TestimonialController.DeleteTestimonial);
Router.get("/testimonialForEdit/:id",verifyToken,TestimonialController.getoneTestimonialforEdit);
Router.put("/testimonialUpdate/:id",upload.single("image"),verifyToken,TestimonialController.UpdateTestimonial)
// MememershipPcakge -called from frontend
// Router.post("/packageBill",SubpackageController.userspacakge)
Router.get("/Subscribedusers",verifyToken,SubpackageController.subscribedusers)
Router.get("/pakageView/:id",verifyToken,SubpackageController.forViewpackages)
// Router.post("/renewData/:id",SubpackageController.userspacakgeRenew)
// PlantypeEngine
Router.post("/plantypePost",plantypeController.createplantype)
Router.get("/plantypeGet",verifyToken,plantypeController.getplantype)
Router.delete("/plantypeDelete/:id",plantypeController.Deleteplantype)
Router.get("/getplanedit/:id",verifyToken,plantypeController.getplantyepforEdit)
Router.put("/plantypeUpdate/:id",verifyToken,plantypeController.UpdatePlantype)
// blogEngine
Router.post("/blogPost",upload.single('image'),Blogcontroller.createblog)
Router.get("/blogGet",verifyToken,Blogcontroller.getblog)
Router.get("/blogedit/:id",verifyToken,Blogcontroller.getblogforedit)
Router.delete("/blogdelete/:id",Blogcontroller.bolgdelete)
Router.put(`/updateblog/:id`,upload.single("image"),verifyToken,Blogcontroller.updateblog)
Router.get("/viewblog/:id",verifyToken,Blogcontroller.getblogforedit)
// GalleryEngine
Router.post("/galleryPost",upload.single('image'),GalleryController.galleryCreate)
Router.get("/galleryGet",verifyToken,GalleryController.galleryGet)
Router.get("/galleryedit/:id",verifyToken,GalleryController.galleryedit)
Router.put(`/galleryUpdate/:id`,upload.single("image"),verifyToken,GalleryController.galleryUpdate)
Router.delete("/deletegallery/:id",GalleryController.deletegallery)
// subscibed or not 
Router.get("/subscribedornot",verifyToken,SubpackageController.subscribedusers)
//DashboardEngine
Router.get("/signupcount",signupController.Getusers)
Router.get("/subscribedUsersCount",SubpackageController.subscribedusers)
Router.get("/totalworkoutplan",workoutcontroller.workoutplancount)
Router.get("/totaldietplancount",dietcontroller.dietplancount)
Router.get("/trainersCount",trainersController.trainersCount)
Router.get("/totalexpired",SubpackageController.totalexpired)
Router.get("/totalactive",SubpackageController.totalactive)
// Graph
Router.get("/fetchGraph",GraphController.GetMonthlySubscriptions)
Router.get("/fetchsalesGraph",GraphController.GetMonthlySales)
// Subscribed latest six
Router.get("/latestsixsubscribers",SubpackageController.subscriberslastsix)
// Registraion-called from frontend
Router.post("/registration",signupController.signupform)
// messages-from users 
Router.post("/sendmsg",contactController.messageSending)
Router.post("/payment",SubpackageController.paymentDetails)
// razorpayPaymentorder 


module.exports = Router;