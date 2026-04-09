import mongoose from "mongoose";

const vendorsubscriptionschema = new mongoose.Schema({
    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor',
        required:true
    },
    duration:{
        type:String,
        required:true
    }, 
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }  
})

const vendorsubscription = mongoose.model.vendorsubscription ||mongoose.model('vendorsubscription',vendorsubscriptionschema);
export default vendorsubscription;