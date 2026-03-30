import mongoose from "mongoose";

const vendorsubscriptionschema = new mongoose.Schema({
    vendor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor',
        require:true
    },
    duration:{
        type:String,
        require:true
    }, 
    description:{
        type:String,
    },
    price:{
        type:Number,
        require:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    }  
})

const vendorsubscription = mongoose.model.vendorsubscription ||mongoose.model('vendorsubscription',vendorsubscriptionschema);
export default vendorsubscription;