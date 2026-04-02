import express from 'express';
import { FRONTEND_URL, PORT } from './src/config/config.js';
import { connectDB } from './src/Db/database.js';

import { indexRoute } from './src/routes/index.routes.js';
const app= express();



connectDB().then(()=>{
    console.log('Connected to MongoDB');
    SERVER();

}).catch((err)=>{
    console.error('Error connecting to MongoDB', err);
});

 


const SERVER = async () =>{
  app.use((req, res, next) => {
    console.log(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${
        req.socket.remoteAddress
      }] - Time: [${new Date()}]`
    );

    res.on("finish", () => {
      console.log(
        `Finish -> Method: [${req.method}] - Url: [${req.url}] - IP: [${
          req.socket.remoteAddress
        }] - Time: [${new Date()}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = FRONTEND_URL.split(",");
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-with,Content-Type,Accept,Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // Expose custom headers to the frontend
    res.header("Access-Control-Expose-Headers", "X-Error-Message");

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});
    }
    next();
  });
  app.use(express.json());
app.use('/api/v1',indexRoute);
    app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
}