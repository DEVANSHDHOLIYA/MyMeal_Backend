import mongoose from "mongoose";
import HTTP from "../../constants/httpStatusCode.js";
import User from "../../models/user.js";
import Vendor from "../../models/vendor.js";
import Rating from "../../models/vendor/vendorrating.js";
import vendorsubscription from "../../models/vendor/vendorsubscription.js";
import usersubscription from "../../models/user/usersubscription.js";
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

const getsubscription = async (req, res, next) => {
  const subscription = await usersubscription.findOne({ user_id: req.user_id }).populate("subscription_id","duration price").populate("user_id","name email");
  if (!subscription) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "Subscription not found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: subscription,
  });
}
const pausesubscription = async (req, res, next) => {
  const subscription = await usersubscription.findOne({ user_id: req.user_id, subscription_id: req.body.subscription_id });
  if (!subscription) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "Subscription not found",
    });
  }
  if(subscription.ispaused==true){
    await usersubscription.updateOne({ user_id: req.user_id, subscription_id: req.body.subscription_id }, { $set: { ispaused: false, pausedate: null } });
    return res.status(HTTP.SUCCESS).json({
      success: false, 
      message: "Subscription Resumed Successfully",
    });

  }
  const date=new Date();
  await usersubscription.updateOne({ user_id: req.user_id, subscription_id: req.body.subscription_id }, { $set: { ispaused: true, pausedate: date } });
  return res.status(HTTP.SUCCESS).json({
    success:true,
    message: "Subscription Paused Successfully",
  });
}


export default { getvendordata, getvendorsubscription,getsubscription ,pausesubscription};
