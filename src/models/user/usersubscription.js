import mongoose from "mongoose";

const usersubscriptionschema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    subscription_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription',    
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
    }

});

const usersubscription = mongoose.model.usersubscription ||mongoose.model("usersubscription", usersubscriptionschema);
export default usersubscription;