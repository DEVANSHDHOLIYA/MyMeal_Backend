import { MONGODB_URL } from "../config/config.js";
import mongoose from 'mongoose';
export const connectDB= async()=>{
    await mongoose.connect(MONGODB_URL);
    
}