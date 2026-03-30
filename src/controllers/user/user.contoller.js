import mongoose from "mongoose";
import HTTP from "../../constants/httpStatusCode.js";
import User from "../../models/user.js";
import Vendor from "../../models/vendor.js";
import Rating from "../../models/vendor/vendorrating.js";
import vendorsubscription from "../../models/vendor/vendorsubscription.js";
const getvendordata = async (req, res, next) => {
  const vendordata = await Vendor.find({});
  if (!vendordata) {
    return res.status(HTTP.NO_CONTENT).json({
      success: false,
      message: "No vendor found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: vendordata,
  });
};
const giverating = async (req, res, next) => {
  if (
    await Rating.findOne({
      user_id: req.user_id,
      vendor_id: req.body.vendor_id,
    })
  ) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "You have already given rating to this vendor",
    });
  }
  try {
    await Rating.create({
      user_id: req.user_id,
      vendor_id: req.body.vendor_id,
      rating: req.body.rating,
      review: req.body.review,
    });
    const total_rating = await Rating.aggregate([
      {
        $match: { vendor_id: new mongoose.Types.ObjectId(req.body.vendor_id) },
      },
      {
        $group: {
          _id: "$vendor_id",
          avgrating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    await Vendor.findByIdAndUpdate(req.body.vendor_id, {
      rating: total_rating[0].avgrating,
    });

    return res.status(HTTP.SUCCESS).json({
      success: true,
      message: "Rating given successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Error in giving rating",
    });
  }
};

const getvendorsubscription = async (req, res, next) => {
  const subscription = await vendorsubscription.find({
    vendor_id: req.params.vendor_id,
  });
  if (!subscription) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "Vendor does not have any subscription",
    });
  }
  
  const vendordata = await Vendor.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.params.vendor_id) },
    },
    {
      $project: {
          companyname:1,
          phoneno:1,
          rating:1,
          city:1,
          about:1,
      }
    },
  ]);
  if (!vendordata) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "Vendor not found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: { subscription, vendordata },
  });
};
export default { getvendordata, giverating, getvendorsubscription };
