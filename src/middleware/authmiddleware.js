import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import HTTP from '../constants/httpStatusCode.js';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(HTTP.UNAUTHORIZED).json({
      success: false,
      message: "Session Expired. Please Login Again."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user_id = decoded.id;
    next();
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).json({
        success:false,
        message:"Invaid token."
    })
  }
};

export default auth;