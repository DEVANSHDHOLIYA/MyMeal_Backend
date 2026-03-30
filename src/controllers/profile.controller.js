import User from "../models/user.js";
import HTTP from "../constants/httpStatusCode.js";
import Vendor from "../models/vendor.js";
const profile = async (req, res, next) => {
  const Userdata = await User.findById(req.user_id);
  if (!Userdata) {
    return res.status(HTTP.NO_CONTENT).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,  
    data: Userdata,
  });
};

const vendor_profile = async (req, res, next) => {
  const Userdata = await Vendor.findById(req.user_id);
  if (!Userdata) {
    return res.status(HTTP.NO_CONTENT).json({
      success: false,
      message: "Vendor not found",
    });
  }
  return res.status(HTTP.SUCCESS).json({
    success: true,  
    data: Userdata,
  });
};

const profileupdate = async (req, res, next) => {

  if(await User.findOne({_id:{$ne:req.user_id},phoneno:req.body.phoneno})){
    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"User with this phone no already exists"
    });
}
  try{
    
    await User.findByIdAndUpdate(req.user_id, { name: req.body.name,state: req.body.state,pincode: req.body.pincode ,address: req.body.address,phoneno: req.body.phoneno,city:req.body.city,country:req.body.country});
     return res.status(HTTP.SUCCESS).json({
    success: true,
    message: "Profile updated successfully",
  });
  }
  catch(err) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Error updating profile",
    });
  }
 
};
const vendor_profileupdate = async (req, res, next) => {

  if(await Vendor.findOne({_id:{$ne:req.user_id},phoneno:req.body.phoneno})){
    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"Vendor with this phone no already exists"
    });
}
  try{
    
    await Vendor.findByIdAndUpdate(req.user_id, { name: req.body.name,upiid:req.body.upiid,about:req.body.about,pincode: req.body.pincode,companyname: req.body.companyname ,state: req.body.state,address: req.body.address,phoneno: req.body.phoneno,city:req.body.city,country:req.body.country});
     return res.status(HTTP.SUCCESS).json({
    success: true,
    message: "Profile updated successfully",
  });
  }
  catch(err) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Error updating profile",
    });
  }
 
};

export default { profile, profileupdate,vendor_profile,vendor_profileupdate };
