const asyncHandler = require("express-async-handler");
const packageModel = require("../model/subpackagemodel");
const Usersignupmodel = require("../model/signupmodel");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const payementordermodel = require("../model/payementordermodel");
exports.getrenewdata = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const renewData = await packageModel.findById(id);
    res.json(renewData);
  } catch (error) {
    console.log(error);
  }
});
exports.subscribedusers = asyncHandler(async (req, res) => {
  try {
    const statuss = req.query.statuss || "";
    const startDate = req.query.findstartdate || "";
    const endDate = req.query.findenddate || "";
    const page = parseInt(req.query.page);
    const pagesize = parseInt(req.query.limit);
    const skip = (page - 1) * pagesize;
    let query = {};
    if (statuss) {
      query.status = statuss;
    }
    if (startDate && endDate) {
      const inputstartDate = new Date(startDate);
      const inputendDate = new Date(endDate);
      if (!isNaN(inputstartDate) && !isNaN(inputendDate)) {
        const formattedstartDate = inputstartDate.toISOString().split("T")[0];
        const formattedendDate = inputendDate.toISOString().split("T")[0];
        const nextDay = new Date(inputendDate);
        nextDay.setDate(inputendDate.getDate() + 1);
        query.createdAt = {
          $gte: formattedstartDate,
          $lt: nextDay.toISOString(),
        };
        if (formattedstartDate === formattedendDate) {
          query.createdAt = {
            $gte: formattedstartDate,
            $lt: nextDay.toISOString(),
          };
        }
      } else {
        throw new Error("Invalid date format");
      }
    }
    const totalitems = await packageModel.countDocuments(query);
    const totalpages = Math.ceil(totalitems / pagesize);
    const subscribedList = await packageModel
      .find(query)
      .skip(skip)
      .limit(pagesize)
      .exec();
    const userLatestPackages = {};
    // Finding the latest package for each user
    subscribedList.forEach((package) => {
      if (!userLatestPackages[package.userID]) {
        userLatestPackages[package.userID] = package;
      } else {
        if (
          package.expiry_date > userLatestPackages[package.userID].expiry_date
        ) {
          userLatestPackages[package.userID] = package;
        }
      }
    });
    const userIDs = Object.keys(userLatestPackages);
    for (const userID of userIDs) {
      const latestPackage = userLatestPackages[userID];
      const currentDate = new Date();
      const status = latestPackage.expiry_date < currentDate ? "expired" : "active";
      await packageModel.findOneAndUpdate(
        { _id: latestPackage._id },
        { $set: { status: status } },
        { new: true }
      );
      if (status === "expired") {
        await Usersignupmodel.findOneAndUpdate(
          { _id: userID },
          { $set: { type: "Not Subscribed" } },
          { new: true }
        );
      }
    }
    res.json({ subscribedList, totalpages, totalitems });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "internal server error" });
  }
});
exports.forViewpackages = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Check if the id is a valid ObjectId before attempting to query
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const data = await packageModel.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Package not found" });
    }
    const create = data.createdAt;
    const today = new Date();
    const monthDiff = calculateMonthDifference(create, today);

    res.json({ data, monthDiff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
function calculateMonthDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth() + 1;
  months += end.getMonth() + 1;

  return months <= 0 ? 1 : months;
}
// for userprofile recent subscrption plan
exports.forpackageid = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await packageModel
      .findOne({ userID: id })
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Package not found" });
  }
});
// for mysubscription  list user all plan
exports.listuserallplan = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const packages = await packageModel.find({ userID: id });
    let remainingDays = null;
    for (const pkg of packages) {
      const currentDate = new Date();
      const status = pkg.expiry_date < currentDate ? "expired" : "active";
      const expirationDate = new Date(pkg.expiry_date);
      const tenDaysBefore = getTenDaysBefore(expirationDate);
      if (currentDate > tenDaysBefore && currentDate < expirationDate) {
        remainingDays = getRemainingDays(expirationDate);
        break; // Exit loop if condition is met
      }
      // Update the status field in the database
      await packageModel.findOneAndUpdate(
        { _id: pkg._id },
        { $set: { status: status } },
        { new: true } // To return the updated document
      );
      // Update the status in the fetched data to be sent in the response
      pkg.status = status;
    }
    res.json({ data: packages, remainingDays: remainingDays });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
exports.listuserstatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const packages = await packageModel.find({ userID: id });
    let activePackage = null;

    for (const pkg of packages) {
      if (pkg.status === "active") {
        activePackage = pkg; // Store the active package data
        break; // Exit the loop once an active package is found
      }
    }
    if (activePackage !== null) {
      res.json({ data: activePackage }); // Send the active package data to the frontend
    } else {
      res.json({ data: null }); // If no active package is found, send null as data
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
function getRemainingDays(expirationDate) {
  const now = new Date();
  const diffInMs = expirationDate - now;
  const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return daysRemaining;
}
function getTenDaysBefore(expirationDate) {
  const tenDaysBefore = new Date(expirationDate);
  tenDaysBefore.setDate(expirationDate.getDate() - 10); // Calculate 10 days before expiration date
  return tenDaysBefore;
}
exports.recectstatuscheking = asyncHandler(async (req, res) => {
  try {
    const mostRecentPurchase = await packageModel
      .findOne()
      .sort({ createdAt: -1 });

    if (!mostRecentPurchase) {
      return res.status(404).send({ message: "No recent purchase found" });
    }
    const currentDate = new Date();
    const status =
      mostRecentPurchase.expiry_date < currentDate ? "expired" : "active";

    res.json({ _id: mostRecentPurchase._id, status: status, packageId: _id });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
});
exports.totalexpired = asyncHandler(async (req, res) => {
  try {
    const data = await packageModel.countDocuments({ status: "expired" });
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});
exports.totalactive = asyncHandler(async (req, res) => {
  try {
    const data = await packageModel.countDocuments({ status: "active" });
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});
exports.subscriberslastsix = asyncHandler(async (req, res) => {
  try {
    const data = await packageModel.find().sort({ _id: -1 }).limit(6);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// razorpay
exports.makeorder = asyncHandler(async (req, res) => {
  let razorpayOrder;
  try {
    const type = req.query.action;
    const {
      packageId,
      oldpkId,
      monthDiff,
      userID,
      username,
      phonenumber,
      email,
      pin,
      location,
      country,
      duration,
      monthlyfee,
      onetimeentrollmentfee,
      previous,
      key_id,
      KeySecret,
    } = req.body;
    const extractedDuration =
      typeof duration === "string"
        ? parseInt(duration.replace(/\D/g, ""), 10)
        : 0;
    const totalpaid =
      extractedDuration * parseInt(monthlyfee) +
      parseInt(onetimeentrollmentfee);
    let expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + extractedDuration);
    const existingPackage = await payementordermodel.findOne({
      userID: userID,
      expiry_date: { $gt: new Date() },
    });
    if (existingPackage) {
      if (type === "upgrade") {
        const oldpackage = await packageModel.findById(oldpkId);
        const monthold = oldpackage.monthlyfee;
        const oldduration = oldpackage.duration;

        await payementordermodel.findOneAndUpdate(
          { userID: userID, expiry_date: { $gt: new Date() } },
          { $set: { expiry_date: new Date() } }
        );
        const balance = oldduration - monthDiff;
        const previous = balance * monthold;
        const packagedata = await payementordermodel.create({
          expiry_date: expirationDate,
          packageId: packageId,
          userID: userID,
          username: username,
          phonenumber: phonenumber,
          email: email,
          pin: pin,
          location: location,
          country: country,
          duration: extractedDuration,
          monthlyfee: monthlyfee,
          onetimeentrollmentfee: onetimeentrollmentfee,
          type: type,
          previous: previous,
          totalpaid: totalpaid,
          balanceAmount: totalpaid - previous,
          status: "active",
        });
        await Usersignupmodel.findOneAndUpdate(
          { _id: userID },
          { $set: { type: "subscribe" } }
        );
        const orderId = packagedata._id;
        razorpayOrder = await createRazorpayOrder(
          key_id,
          KeySecret,
          totalpaid-previous,
          orderId
        );
      } else {
        res
          .status(400)
          .json({ message: "You already have an active package." });
        return;
      }
    } else {
      const packagedata = await payementordermodel.create({
        expiry_date: expirationDate,
        packageId: packageId,
        userID: userID,
        username: username,
        phonenumber: phonenumber,
        email: email,
        pin: pin,
        type: type,
        location: location,
        country: country,
        duration: extractedDuration,
        monthlyfee: monthlyfee,
        onetimeentrollmentfee: onetimeentrollmentfee,
        previous: previous,
        totalpaid: totalpaid,
        balanceAmount: totalpaid - previous,
        status: "active",
      });

      await Usersignupmodel.findOneAndUpdate(
        { _id: userID },
        { $set: { type: "subscribe" } }
      );

      const orderId = packagedata._id;
      razorpayOrder = await createRazorpayOrder(
        key_id,
        KeySecret,
        totalpaid,
        orderId
        
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  res.json(razorpayOrder);
});
async function createRazorpayOrder(key_id, KeySecret, totalpaid, orderId) {
  const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: KeySecret,
  });
  const options = {
    amount: totalpaid * 100,
    currency: "INR",
    receipt: orderId,
    payment_capture: 1,
  };
  try {
    const response = await razorpay.orders.create(options);
    return {
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    };
  } catch (err) {
    return { error: "Not able to create order. Please try again!" };
  }
}
// //payment
exports.paymentDetails = asyncHandler(async (req, res) => {
  const { status, orderDetails, key_id, KeySecret } = req.body;
  try {
    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: KeySecret,
    });

    const response = await razorpay.orders.fetch(orderDetails.orderId);
    const payorderId = await payementordermodel.findById(response.receipt);
    const payId = orderDetails.paymentId;
    if (status === "succeeded"){
      await packageModel.create({
        paymentId: payId,
        expiry_date: payorderId.expiry_date,
        created_at: payorderId.createdAt,
        packageId: payorderId.packageId,
        userID: payorderId.userID,
        username: payorderId.username,
        phonenumber: payorderId.phonenumber,
        email: payorderId.email,
        pin: payorderId.pin,
        location: payorderId.location,
        country: payorderId.country,
        duration: payorderId.duration,
        monthlyfee: payorderId.monthlyfee,
        onetimeentrollmentfee: payorderId.onetimeentrollmentfee,
        type: payorderId.type,
        previous: payorderId.previous,
        totalpaid: payorderId.totalpaid,
        balanceAmount: payorderId.balanceAmount,
        status: payorderId.status,
      });
      res.status(200).json({ message: "Payment details logged successfully" });
    } else if (status === "failed") {
      res.status(400).json({ message: "payment process failed" });
    }
  } catch (error) {
    console.error("Error processing payment details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
