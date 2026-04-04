import express from 'express';
import { FRONTEND_URL, PORT,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,CLOUDINARY_NAME } from './src/config/config.js';
import { connectDB } from './src/Db/database.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import { indexRoute } from './src/routes/index.routes.js';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key:CLOUDINARY_API_KEY,
  api_secret:CLOUDINARY_API_SECRET,
});
const app= express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:4173",
      ...FRONTEND_URL.split(",")
    ];

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/api/v1',indexRoute);
connectDB().then(()=>{
    console.log('Connected to MongoDB');
    SERVER();
}).catch((err)=>{
    console.error('Error connecting to MongoDB', err);
});



const SERVER = async () =>{
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
}