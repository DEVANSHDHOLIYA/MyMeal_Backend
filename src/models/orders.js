import mongoose from "mongoose";

const orderschema = new mongoose.Schema({
    meal_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'meals',
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    isDelivered:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Order = mongoose.model.order ||mongoose.model('order',orderschema);
export default Order;

