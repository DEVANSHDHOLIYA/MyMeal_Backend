import Meal from "../models/meal.js";
import HTTP from "../constants/httpStatusCode.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const addmeal = async (req, res, next) => {
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

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const mealphoto = {
      public_id: result.public_id,
      url: result.url,
    };
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Delete error:", err);
    });
    await Meal.create({
      vendor_id: req.user_id,
      subscription_id: req.body.subscription_id,
      meal_date: req.body.meal_date,
      mealtime: req.body.mealtime,
      items: req.body.items,
      price: req.body.price,
      isavilable: "true",
      mealphoto: mealphoto,
    });
    return res.status(HTTP.SUCCESS).json({
      success: true,
      message: "Meal added successfully",
    });
  } catch (err) {
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
export default { addmeal, getmeal, getmeal_user,mealbuydata };
