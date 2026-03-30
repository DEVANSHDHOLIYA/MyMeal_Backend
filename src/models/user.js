import mongoose, { Schema,model } from 'mongoose';
import { Roles } from '../enums/index.js';

const userschema = new Schema({
    name:{
        type: String,
        require : true,
    },
    email:{
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
    phoneno:{
        type:Number
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    pincode:{
        type:Number
    },
    country:{
        type:String
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
})

const User= mongoose.models.user || model("user",userschema);
export default User;