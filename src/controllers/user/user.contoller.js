import mongoose from "mongoose";
import HTTP from "../../constants/httpStatusCode.js";
import Vendor from "../../models/vendor.js";
import User from "../../models/user.js";
import Meal from "../../models/meal.js";
import vendorsubscription from "../../models/vendor/vendorsubscription.js";
import usersubscription from "../../models/user/usersubscription.js";
import { sendSkipMealEmail, sendMealSelectionEmail } from "../../helper/emailjs.js";

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
          avatar:1,
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
  const subscription = await usersubscription.findOne({ user_id: req.user_id })
    .populate({
      path: "subscription_id",
      select: "duration price vendor_id description",
      populate: {
        path: "vendor_id",
        select: "companyname city state avatar phoneno"
      }
    })
    .populate("user_id", "name email");

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

const skiptodaymeal = async (req, res, next) => {
  try {
    const subscription = await usersubscription.findOne({ user_id: req.user_id }).populate("subscription_id");
    if (!subscription) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: "No active subscription found",
      });
    }

    // Get today's date as YYYY-MM-DD in local time
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    let message = "";
    let is_skipped = false;
    const index = subscription.skippedDates.indexOf(todayStr);
    if (index > -1) {
      // Unskip if already skipped
      subscription.skippedDates.splice(index, 1);
      message = "Resumed today's meal delivery";
      is_skipped = false;
    } else {
      // Skip today's meal
      subscription.skippedDates.push(todayStr);
      message = "Skipped today's meal delivery successfully";
      is_skipped = true;
    }

    await subscription.save();

    // Trigger email alerts asynchronously
    try {
      const userDoc = await User.findById(req.user_id);
      const vendorDoc = await Vendor.findById(subscription.subscription_id.vendor_id);
      if (userDoc && vendorDoc) {
        await sendSkipMealEmail({
          user_name: userDoc.name,
          user_email: userDoc.email,
          vendor_name: vendorDoc.companyname,
          vendor_email: vendorDoc.email,
          is_skipped
        });
      }
    } catch (mailErr) {
      console.error("Skip email warning:", mailErr);
    }

    return res.status(HTTP.SUCCESS).json({
      success: true,
      message,
      skippedDates: subscription.skippedDates,
    });
  } catch (err) {
    console.error(err);
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing skip meal request",
    });
  }
};

const selectdailymeal = async (req, res, next) => {
  try {
    const { meal_id, option } = req.body;
    if (!meal_id || !option) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Meal ID and option are required",
      });
    }

    const subscription = await usersubscription.findOne({ user_id: req.user_id });
    if (!subscription) {
      return res.status(HTTP.NOT_FOUND).json({
        success: false,
        message: "No active subscription found",
      });
    }

    // Get today's local date as YYYY-MM-DD
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Find if selection for today already exists
    const existingIndex = subscription.selectedMeals.findIndex((m) => m.date === todayStr);
    if (existingIndex > -1) {
      subscription.selectedMeals[existingIndex].meal_id = meal_id;
      subscription.selectedMeals[existingIndex].option = option;
    } else {
      subscription.selectedMeals.push({
        date: todayStr,
        meal_id,
        option,
      });
    }

    await subscription.save();

    // Trigger email alerts asynchronously
    try {
      const userDoc = await User.findById(req.user_id);
      const mealDoc = await Meal.findById(meal_id);
      const vendorDoc = await Vendor.findById(mealDoc.vendor_id);
      if (userDoc && mealDoc && vendorDoc) {
        await sendMealSelectionEmail({
          user_name: userDoc.name,
          user_email: userDoc.email,
          vendor_name: vendorDoc.companyname,
          vendor_email: vendorDoc.email,
          meal_name: mealDoc.meals?.[option] || "Standard Meal Package",
          option
        });
      }
    } catch (mailErr) {
      console.error("Meal choice email alert error:", mailErr);
    }

    return res.status(HTTP.SUCCESS).json({
      success: true,
      message: `Successfully selected ${option} meal for today`,
      selectedMeals: subscription.selectedMeals,
    });
  } catch (err) {
    console.error(err);
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error selecting today's meal",
    });
  }
};

export default { getvendordata, getvendorsubscription, getsubscription, pausesubscription, skiptodaymeal, selectdailymeal };
