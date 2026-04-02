import HTTP from '../constants/httpStatusCode.js';
import User from '../models/user.js';
import OTP from '../models/otp.js';
import Vendor from '../models/vendor.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'
import { JWT_SECRET } from '../config/config.js';
import { Roles } from '../enums/index.js';
import { generateOTP, sendOTPEmail } from '../helper/emailjs.js';
const signup = async (req, res,next) => {
    if(await User.findOne({email:req.body.email})){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"User with this email already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const otp = generateOTP();

    await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        Role:Object.values(Roles)[0],
        city:req.body.city,
        state:req.body.state,
        address:req.body.address,
        pincode:req.body.pincode,
        country:req.body.country,
        phoneno:req.body.phoneno
    });
    await OTP.create({
        email:req.body.email,
        otp:otp,
        Expirein:new Date(Date.now() + 15 * 60 * 1000)
    });
    const emailres= await sendOTPEmail(req.body.email, otp);
    if(!emailres.success){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Error sending OTP email",
        });
    }
    return res.status(HTTP.SUCCESS).json({
        success:true,
        message:"Otp sent Successfully"
    });
}

const login = async (req, res,next) => {
   const userdata = await User.findOne({ email: req.body.email }).select({ password: 1, isVerified: 1 });
    if(!userdata){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"User with this email does not exist"
        });
    }
    if(!await bcrypt.compare(req.body.password, userdata.password)){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Incorrect password"
        });
    }
    if(userdata.isVerified==false){
        const otp = generateOTP();
        const emailres= await sendOTPEmail(req.body.email, otp);
        await OTP.findOneAndUpdate({email:req.body.email}, {otp:otp, Expirein:new Date(Date.now() + 15 * 60 * 1000)});
        if(!emailres.success){
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Error sending OTP email",
            });
        }
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Verify your account first. mail has been sent to your email"
        });
    }
    const token = JWT.sign({id:userdata._id}, JWT_SECRET, {expiresIn:'1d'});
    await User.findByIdAndUpdate(userdata._id,{jwtToken:token});
    return res.status(HTTP.SUCCESS).json({
        success:true,
        message:"User Logged in Successfully",
        token: token
    })
}
const resetpassword = async (req,res,next) => {
    if(User.findOne({email:req.body.email})){
        const otp = generateOTP();
        await OTP.findOneAndUpdate({email:req.body.email}, {otp:otp, Expirein:new Date(Date.now() + 15 * 60 * 1000), valid:true});
        const emailres= await sendOTPEmail(req.body.email, otp);
        if(!emailres.success){
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Error sending OTP email",
            });
        }
        return res.status(HTTP.SUCCESS).json({
            success:true,
            message:"Otp sent Successfully"
        });
    }
    
}
const changepassword = async (req,res,next) => {
    if(await OTP.findOne({otp:req.body.otp, Expirein:{$gt:new Date()}, valid:true})){
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const data= await OTP.findOne({otp:req.body.otp});
        await User.findOneAndUpdate({email:data.email}, {password:hashedPassword});
        await OTP.findOneAndUpdate({email:data.email}, {valid:false});
        return res.status(HTTP.SUCCESS).json({
            success:true,
            message:"Password Changed Successfully"
        });
    }
    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"Invalid OTP OR OTP Expired"
    })
}
const VerifyOTP = async (req, res,next) => {
    if(await OTP.findOne({email:req.body.email, otp:req.body.otp, Expirein:{$gt:new Date()}, valid:true})){
        await OTP.findOneAndUpdate({email:req.body.email}, {valid:false});
        await User.findOneAndUpdate({email:req.body.email}, {isVerified:true});
        return res.status(HTTP.SUCCESS).json({
            success:true,
            message:"OTP Verified Successfully"
        });
    }

    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"Invalid OTP OR OTP Expired"
    });


}
const vendorVerifyOTP = async (req, res,next) => {
    if(await OTP.findOne({email:req.body.email, otp:req.body.otp, Expirein:{$gt:new Date()}, valid:true})){
        await OTP.findOneAndUpdate({email:req.body.email}, {valid:false});
        await Vendor.findOneAndUpdate({email:req.body.email}, {isVerified:true});
        return res.status(HTTP.SUCCESS).json({
            success:true,
            message:"OTP Verified Successfully"
        });
    }

    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"Invalid OTP OR OTP Expired"
    });


}
const Resendotp =async (req,res,next) => {
    const otp = generateOTP();
    await OTP.findOneAndUpdate({email:req.body.email}, {otp:otp, Expirein:new Date(Date.now() + 15 * 60 * 1000), valid:true});
    const emailres= await sendOTPEmail(req.body.email, otp);
    if(!emailres.success){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Error sending OTP email",
        });
    }
    return res.status(HTTP.SUCCESS).json({
        success:true,
        message:"Otp sent Successfully"
    }); 
    
}

const vendorsignup = async (req, res,next) => {
    if(await Vendor.findOne({email:req.body.email})){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Vendor with this email already exists"
        });
    }
    if(await Vendor.findOne({phoneno:req.body.phoneno})){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Vendor with this phone number already exists"
        });
    }
    if(await Vendor.findOne({companyname:req.body.companyname})){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Vendor with this company name  already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const otp = generateOTP();
    await Vendor.create({
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword,
    Role:Object.values(Roles)[1],
    phoneno:req.body.phoneno,
    companyname:req.body.companyname,
    });
    await OTP.create({
        email:req.body.email,
        otp:otp,
        Expirein:new Date(Date.now() + 15 * 60 * 1000)
    });
    const emailres= await sendOTPEmail(req.body.email, otp);
    if(!emailres.success){
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Error sending OTP email",
        });
    }
    return res.status(HTTP.SUCCESS).json({
        success:true,
        message:"OTP sent Successfully"
    });
}


const vendorlogin = async (req, res,next) => {
    const vendordata= await Vendor.findOne({email:req.body.email}).select("+password");
    if(!vendordata){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Vendor with this email does not exist"
        });
    }
    if(!await bcrypt.compare(req.body.password, vendordata.password)){
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Incorrect password"
        });
    }
    if(vendordata.isVerified==false){
        const otp = generateOTP();
        const emailres= await sendOTPEmail(req.body.email, otp);
        await OTP.findOneAndUpdate({email:req.body.email}, {otp:otp, Expirein:new Date(Date.now() + 15 * 60 * 1000)});
        if(!emailres.success){
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Error sending OTP email",
            });
        }
        return res.status(HTTP.BAD_REQUEST).json({
            success:false,
            message:"Verify your account first. mail has been sent to your email"
        });
    }
    const token = JWT.sign({id:vendordata._id}, JWT_SECRET, {expiresIn:'1d'});
    await Vendor.findByIdAndUpdate(vendordata._id,{jwtToken:token});
    return res.status(HTTP.SUCCESS).json({
        success:true,
        message:"Vendor Logged in Successfully",
        token: token
    })

}
const vendorchangepassword = async (req,res,next) => {
    if(await OTP.findOne({otp:req.body.otp, Expirein:{$gt:new Date()}, valid:true})){
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const data= await OTP.findOne({otp:req.body.otp});
        await Vendor.findOneAndUpdate({email:data.email}, {password:hashedPassword});
        await OTP.findOneAndUpdate({email:data.email}, {valid:false});
        return res.status(HTTP.SUCCESS).json({
            success:true,
            message:"Password Changed Successfully"
        });
    }
    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"Invalid OTP OR OTP Expired"
    })
}
const vendorresetpassword = async (req,res,next) => {
    if(Vendor.findOne({email:req.body.email})){
        const otp = generateOTP();
        await OTP.findOneAndUpdate({email:req.body.email}, {otp:otp, Expirein:new Date(Date.now() + 15 * 60 * 1000), valid:true});
        const emailres= await sendOTPEmail(req.body.email, otp);
        if(!emailres.success){
            return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Error sending OTP email",
            });
        }
        return res.status(HTTP.SUCCESS).json({
            success:true,
            message:"Otp sent Successfully"
        });
    }
    
}
export default {signup, login, vendorsignup,vendorchangepassword,vendorresetpassword, vendorlogin,VerifyOTP,vendorVerifyOTP,Resendotp,resetpassword,changepassword};
