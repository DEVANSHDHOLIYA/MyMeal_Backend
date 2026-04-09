import mongoose from "mongoose";

const mealschema = new mongoose.Schema({
  mealphoto: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
    required: true,
  },
  meal_date:{
    type: Date,
    required: true,
  },
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendorsubscription",
   
  },
  items: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isavilable: {
    type: Boolean,
    default: true,
    
  },
  mealtime: {
    type: String,
    enum: ["lunch", "dinner"],
    required: true,
  }, 
},{timestamps: true});

const Meal = mongoose.models.meals || mongoose.model("meals", mealschema);
export default Meal;
