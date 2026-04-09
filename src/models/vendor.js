import mongoose, { Schema } from "mongoose";
import { Roles } from "../enums/index.js";

const vendorschema = new Schema({
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phoneno: {
    type: String,
    unique: true,
    required: true,
  },
  companyname: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,

  },
  state: {
    type: String,
    required: true,

  },
  country: {
    type: String, 
    required: true
 
  },
  pincode: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  upiid: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0,
  },
  Role: {
    type: String,
    enum: Object.values(Roles),
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  jwtToken: {
    type: String,
  },
});

const Vendor = mongoose.models.vendor || mongoose.model("vendor", vendorschema);
export default Vendor;
