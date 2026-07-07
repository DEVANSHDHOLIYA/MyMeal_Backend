import Meal from "../models/meal.js";
import HTTP from "../constants/httpStatusCode.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import usersubscription from "../models/user/usersubscription.js";
const addmeal = async (req, res, next) => {
  try {
    const subscriptionIds = Array.isArray(req.body.subscription_id)
      ? req.body.subscription_id
      : [req.body.subscription_id];

    const mealdata = await Meal.findOne({
      vendor_id: req.user_id,
      meal_date: req.body.meal_date,
      mealtime: req.body.mealtime,
      subscription_id: { $in: subscriptionIds },
    });

    if (mealdata) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: "Meal already exists for this date and time",
      });
    }

    if (!req.files || !req.files.primary) {
      return res.status(400).json({
        success: false,
        message: "Primary image is required",
      });
    }

    const primaryUpload = await cloudinary.uploader.upload(
      req.files.primary[0].path
    );

    let secondaryUpload = null;
    if (req.files.secondary && req.files.secondary.length > 0) {
      secondaryUpload = await cloudinary.uploader.upload(
        req.files.secondary[0].path
      );
    }

    fs.unlink(req.files.primary[0].path, () => {});
    if (req.files.secondary && req.files.secondary.length > 0) {
      fs.unlink(req.files.secondary[0].path, () => {});
    }

    
    const mealsData = {
      primary: req.body.primary_meal,
    };

    if (req.body.secondary_meal) {
      mealsData.secondary = req.body.secondary_meal;
    }

    // ✅ Prepare mealphoto object
    const mealphotoData = {
      primary: {
        public_id: primaryUpload.public_id,
        url: primaryUpload.url,
      },
    };

    if (secondaryUpload) {
      mealphotoData.secondary = {
        public_id: secondaryUpload.public_id,
        url: secondaryUpload.url,
      };
    }

    await Meal.create({
      vendor_id: req.user_id,
      subscription_id: subscriptionIds,
      meal_date: req.body.meal_date,
      mealtime: req.body.mealtime,
      meals: mealsData,
      mealphoto: mealphotoData,
      price: req.body.price,
      isavilable: true,
    });

    return res.status(HTTP.SUCCESS).json({
      success: true,
      message: "Meal added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Error adding meal",
    });
  }
};

const getmeal = async (req, res, next) => {
  const mealdata = await Meal.find({ vendor_id: req.user_id });
  if (!mealdata) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "No meal found",
    });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredMeals = mealdata.filter((meal) => {
    const mealDate = new Date(meal.meal_date);
    mealDate.setHours(0, 0, 0, 0);

    return mealDate.getTime() === today.getTime();
  });

  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: filteredMeals,
  });
};

const getmeal_user = async (req, res, next) => {
  const mealdata = await Meal.find({ vendor_id: req.params.vendor_id });
  if (!mealdata) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "No meal found",
    });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredMeals = mealdata.filter((meal) => {
    const mealDate = new Date(meal.meal_date);
    mealDate.setHours(0, 0, 0, 0);

    return mealDate.getTime() === today.getTime();
  });

  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: filteredMeals,
  });
};

const subscriptionmeal = async (req, res, next) => {
  const subscriptionid = await usersubscription.find({ user_id:req.user_id},{subscription_id:1,_id:0});
  const subscriptionmealdata = await Meal.find({ subscription_id: subscriptionid[0].subscription_id });
  if (!subscriptionmealdata) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "No meal found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: subscriptionmealdata,
  });

};
const mealbuydata= async (req, res, next) => {
  const mealdata = await Meal.findById(req.params.meal_id);
  if (!mealdata) {
    return res.status(HTTP.NOT_FOUND).json({
      success: false,
      message: "No meal found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,
    data: mealdata,
  });  
}
export default { addmeal, getmeal, getmeal_user,mealbuydata ,subscriptionmeal};
