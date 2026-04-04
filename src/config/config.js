import {config} from 'dotenv';


config({
    path: '.env'
});


export const PORT = process.env.PORT ;
export const MONGODB_URL = process.env.MONGODB_URL ;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
export const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
export const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
export const EMAILJS_OTP_TEMPLATE_ID = process.env.EMAILJS_OTP_TEMPLATE_ID;
export const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const CLOUDINARY_NAME = process.env.CLOUNDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUNDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUNDINARY_API_SECRET;