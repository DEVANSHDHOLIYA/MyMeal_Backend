import mongoose from "mongoose";

const ratingschema = new mongoose.Schema({
    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor',
        require:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true
    },
    rating:{
        type:Number,
        min: 1,
        max: 5,
        require:true
    }, 
    review:{
        type:String,
        require:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }  
})

const Rating = mongoose.model.rating ||mongoose.model('rating',ratingschema);
export default Rating;