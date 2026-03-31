import mongoose from "mongoose";

const usersubscriptionschema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    subscription_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendorsubscription',    
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    ispaid: {
        type:Boolean,
        default: false,
        required: true,
    },
    startdate:{
        type: Date,
        default: Date.now,
        required: true,
    },
    enddate:{
        type: Date,
        required: true,
    },
    ispaused:{
        type:Boolean,
        default:false,
    },
    pausedate:{
        type: Date,
    }

});

const usersubscription = mongoose.model.usersubscription ||mongoose.model("usersubscription", usersubscriptionschema);
export default usersubscription;