import express from "express";
import vendorsubscription from "../../models/vendor/vendorsubscription.js";
import HTTP from "../../constants/httpStatusCode.js";
import Vendor from "../../models/vendor.js";
import usersubscription from "../../models/user/usersubscription.js";
import User from "../../models/user.js";
import { sendboughtsubscriptionmail, sendBuySubscriptionEmail } from "../../helper/emailjs.js";
const Addsubscription = async (req, res, next) => {
  if (
    await vendorsubscription.findOne({
      vendor_id: req.user_id,
      duration: req.body.duration,
    })
  ) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Subscription already exists",
    });
  }
  try {
    await vendorsubscription.create({
      vendor_id: req.user_id,
      duration: req.body.duration,
      description: req.body.description,
      price: req.body.price,
    });
    return res.status(HTTP.SUCCESS).json({
      success: true,
      message: "Subscription created successfully",
    });
  } catch (err) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating subscription",
    });
  }
};

const showsubscription = async (req, res, next) => {
  const subscription = await vendorsubscription.find({
    vendor_id: req.user_id,
  });
  if (!subscription) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Subscription not found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: subscription,
  });
};

const updatesubscription = async (req, res, next) => {
  const subscription = await vendorsubscription.findByIdAndUpdate(
    req.body._id,
    { price: req.body.price, description: req.body.description },
  );
  if (!subscription) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Subscription not found",
    });
  }
  const data = await vendorsubscription.findById(req.body._id);
  return res.status(HTTP.SUCCESS).json({
    success: true,
    message: "Subscription updated successfully",
    data: data,
  });
};

const getsubscription = async (req, res, next) => {
  const subscription = await vendorsubscription.findById(
    req.params.subscription_id,
  );
  if (!subscription) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Subscription not found",
    });
  }
  const vendorid = await Vendor.find({ _id: subscription.vendor_id });
  const upiid = vendorid[0].upiid;
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: { subscription, upiid },
  });
};
const addusersubscription = async (req, res, next) => {
  if (
    await usersubscription.findOne({
      user_id: req.user_id,
      subscription_id: req.body.subscription_id,
      duration: req.body.duration,
    })
  ) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Subscription already Bought",
    });
  }
  const startdate = new Date();
  const planenddate = new Date();
  const planduration = req.body.duration;
  const plan = planduration.split(" ");
  if (plan[1].toLowerCase().includes("month")) {
    planenddate.setMonth(planenddate.getMonth() + parseInt(plan[0]));
  } else if (plan[1].toLowerCase().includes("year")) {
    planenddate.setFullYear(planenddate.getFullYear() + parseInt(plan[0]));
  }
  const price = req.body.price;
  const [userdata, vendorSub] = await Promise.all([
    User.findById(req.user_id, { email: 1,name:1 }),
    vendorsubscription.findById(req.body.subscription_id, { vendor_id: 1 ,description:1}),
  ]);
  if (!vendorSub)
    return res.status(HTTP.NOT_FOUND).json({ message: "Plan not found" });
  const vendordata = await Vendor.findById(vendorSub.vendor_id, {
    companyname: 1,email:1,
  });
  planenddate.setHours(23, 59, 59, 999);
  const subscriptiondata = {
    price: price,
    email: userdata.email,
    vendor_name: vendordata.companyname,
    subscription_id: req.body.subscription_id,
    plan_duration: planduration,
    start_date: startdate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    end_date: planenddate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };
  const boughtsubscriptiondata= {
    name:userdata.name,
    price: price,
    subscription_id: req.body.subscription_id,
    email:vendordata.email,
    plan_duration: planduration,
    start_date: startdate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    end_date: planenddate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };
  
  try {
  await sendBuySubscriptionEmail(subscriptiondata);
  await sendboughtsubscriptionmail(boughtsubscriptiondata);
} catch (emailError) {
  console.error("Email failed to send, but subscription was created:", emailError);
}
  await usersubscription.create({
    user_id: req.user_id,
    subscription_id: req.body.subscription_id,
    ispaid: true,
    duration: planduration,
    description: vendorSub.description,
    startdate: startdate,
    enddate: planenddate,
    ispaused: false,
    pausedate: null,
  });
  return res.status(HTTP.SUCCESS).json({
    success: true,
    message: "Subscription Bought successfully",
  });
};

const getsubscriberinfo = async (req, res, next) => {
    const vendorsubdata=await vendorsubscription.find({ vendor_id: req.user_id });
    if(!vendorsubdata){
        return res.status(HTTP.NOT_FOUND).json({
            success:false,
            message:"Subscribers not found"
        })
    }
    const ids= vendorsubdata.map((item)=>item._id);
    const subsciptiondata = await usersubscription.find({ subscription_id: { $in: ids } }).populate("user_id","name email").populate("subscription_id","duration price");
    if(!subsciptiondata){
        return res.status(HTTP.NOT_FOUND).json({
            success:false,  
            message:"Subscribers not found"
        })
    }
    return res.status(HTTP.SUCCESS).json({
        success:true,
        data:subsciptiondata
    })
}
export default {
  Addsubscription,
  showsubscription,
  updatesubscription,
  getsubscription,
  addusersubscription,
  getsubscriberinfo,
};
