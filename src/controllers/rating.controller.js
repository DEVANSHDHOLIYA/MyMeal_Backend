import mongoose from "mongoose";
import Vendor from "../models/vendor.js";
import Rating from "../models/vendor/vendorrating.js";
import HTTP from "../constants/httpStatusCode.js";
const giverating = async (req, res, next) => {
  if (
    await Rating.findOne({
      user_id: req.user_id,
      vendor_id: req.body.vendor_id,
    })
  ) {
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "You have already given rating to this vendor",
    });
  }
  try {
    await Rating.create({
      user_id: req.user_id,
      vendor_id: req.body.vendor_id,
      rating: req.body.rating,
      review: req.body.review,
    });
    const total_rating = await Rating.aggregate([
      {
        $match: { vendor_id: new mongoose.Types.ObjectId(req.body.vendor_id) },
      },
      {
        $group: {
          _id: "$vendor_id",
          avgrating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const avg = total_rating?.[0]?.avgrating || 0;
    const totalrating = Math.round(avg);

    await Vendor.findByIdAndUpdate(req.body.vendor_id, {
      rating: totalrating,
    });

    return res.status(HTTP.SUCCESS).json({
      success: true,
      message: "Rating given successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(HTTP.BAD_REQUEST).json({
      success: false,
      message: "Error in giving rating",
    });
  }
};

const getratings = async (req, res, next) => {
    const vendorratingdata=await Rating.find({vendor_id:req.params.vendor_id}).populate('user_id','name');
    if(!vendorratingdata){
        return res.status(HTTP.NOT_FOUND).json({
            success:false,
            message:"No rating found for this vendor"
        });
    }
    return res.status(HTTP.SUCCESS).json({
        success:true,
        data:vendorratingdata
    })
}

export default {  giverating, getratings };