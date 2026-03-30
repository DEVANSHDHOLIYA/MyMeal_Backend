import express from 'express';
import { FRONTEND_URL, PORT } from './src/config/config.js';
import { connectDB } from './src/Db/database.js';

import cors from 'cors';
import { indexRoute } from './src/routes/index.routes.js';
const app= express();

app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      FRONTEND_URL
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }))
app.use(express.json());
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