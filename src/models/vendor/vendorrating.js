import mongoose from "mongoose";

const ratingschema = new mongoose.Schema({
    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor',
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    rating:{
        type:Number,
        min: 1,
        max: 5,
        required:true
    }, 
    review:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }  
})

const Rating = mongoose.model.rating ||mongoose.model('rating',ratingschema);
export default Rating;