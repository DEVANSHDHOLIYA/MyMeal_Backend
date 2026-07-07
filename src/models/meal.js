import mongoose from "mongoose";

const mealschema = new mongoose.Schema({
  mealphoto: {
    primary: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    },
    secondary: {
      public_id: { type: String },
      url: { type: String},
    },
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
    type: [mongoose.Schema.Types.ObjectId],
    ref: "vendorsubscription",
   
  },
  meals: {
    primary: {
      type: String,
      required: true,
      isavilable: true,
      default: true,
    },
    secondary: {
      type: String,
      isavilable: true,
    },
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
