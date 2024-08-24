const asyncHandler = require("express-async-handler");
const packageModel = require("../model/subpackagemodel");

exports.GetMonthlySubscriptions = asyncHandler(async (req, res) => {
  try {
    const monthlySubscriptions = await packageModel.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(monthlySubscriptions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.GetMonthlySales = asyncHandler(async (req, res) => {
  try {
    const monthlySubscriptions = await packageModel.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          totalpaid: "$totalpaid",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          totalAmount: { $sum: "$totalpaid" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(monthlySubscriptions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
