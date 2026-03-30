import mongoose from "mongoose";

const otpschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    Expirein:{
        type:Date,
        required:true,
    },
    valid:{
        type:Boolean,
        default:true
    }
    
})
const OTP = mongoose.model.OTP ||mongoose.model('OTP',otpschema);
export default OTP;