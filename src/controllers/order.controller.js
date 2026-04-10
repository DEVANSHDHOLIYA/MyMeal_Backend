import Order from "../models/orders.js";
import HTTP from '../constants/httpStatusCode.js'

const ordermeal = async (req,res,next) => {
    await Order.create({
        user_id: req.user_id,
        meal_id: req.body.meal_id,
        price: req.body.price,
        total: req.body.total,
        quantity: req.body.quantity,
        isPaid: "true",
    })
    return res.status(HTTP.SUCCESS).json({
        success: true,
        message: "Order placed successfully",
      });
}

export default {ordermeal}