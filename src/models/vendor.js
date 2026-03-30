
import mongoose ,{Schema}from 'mongoose';
import { Roles } from '../enums/index.js';

const vendorschema= new Schema({
    name:{
        type: String,
        require : true,
    },
    email:{
        type: String,
        unique: true,
        require : true,
    },
    phoneno:{
        type: String,
        unique: true,
        require : true,
    },
    companyname:{
        type: String,
        unique: true,
        require : true,
    },
    password:{
        type: String,   
        select: false,
        require : true,
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    pincode:{
        type:Number
    },
    about:{
        type:String
    },
    upiid:{
        type:String
    },
    rating:{
        type:Number,
        min: 1,
        max: 5,
        default:0,
    },
    Role:{
        type: String,
        enum: Object.values(Roles),
        require : true,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    jwtToken: {
        type:String,
    }

});

const Vendor=mongoose.models.vendor || mongoose.model("vendor",vendorschema);
export default Vendor;