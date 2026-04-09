import mongoose, { Schema, model } from "mongoose";
import { Roles } from "../enums/index.js";

const userschema = new Schema({
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
  password: {
    type: String,
    select: false,
    required: true,
  },
  address: {
    type: String,
  },
  phoneno: {
    type: Number,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  country: {
    type: String,
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

const User = mongoose.models.user || model("user", userschema);
export default User;
