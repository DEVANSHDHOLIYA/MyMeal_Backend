import Order from "../models/orders.js";
import Meal from "../models/meal.js";
import User from "../models/user.js";
import Vendor from "../models/vendor.js";
import HTTP from '../constants/httpStatusCode.js';
import { sendMealOrderEmail } from "../helper/emailjs.js";

const ordermeal = async (req,res,next) => {
    try {
        const order = await Order.create({
            user_id: req.user_id,
            meal_id: req.body.meal_id,
            price: req.body.price,
            total: req.body.total,
            quantity: req.body.quantity,
            isPaid: "true",
        });

        // Trigger emails asynchronously
        try {
            const userDoc = await User.findById(req.user_id);
            const mealDoc = await Meal.findById(req.body.meal_id);
            const vendorDoc = await Vendor.findById(mealDoc.vendor_id);
            
            if (userDoc && mealDoc && vendorDoc) {
                await sendMealOrderEmail({
                    user_email: userDoc.email,
                    user_name: userDoc.name,
                    vendor_name: vendorDoc.companyname,
                    vendor_email: vendorDoc.email,
                    meal_name: mealDoc.meals?.primary || "Premium Meal",
                    meal_time: mealDoc.mealtime,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    total: req.body.total,
                    order_id: order._id.toString()
                });
            }
        } catch (mailErr) {
            console.error("Order email error:", mailErr);
        }

        return res.status(HTTP.SUCCESS).json({
            success: true,
            message: "Order placed successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error placing order",
        });
    }
}

const getuserorders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user_id: req.user_id })
            .populate({
                path: 'meal_id',
                populate: {
                    path: 'vendor_id',
                    select: 'companyname city state avatar phoneno'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(HTTP.SUCCESS).json({
            success: true,
            data: orders
        });
    } catch (err) {
        console.error(err);
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching user orders"
        });
    }
}

const getvendororders = async (req, res, next) => {
    try {
        // Find all meals created by this vendor
        const meals = await Meal.find({ vendor_id: req.user_id });
        const mealIds = meals.map(m => m._id);

        const orders = await Order.find({ meal_id: { $in: mealIds } })
            .populate('user_id', 'name email phoneno address city state')
            .populate('meal_id')
            .sort({ createdAt: -1 });

        return res.status(HTTP.SUCCESS).json({
            success: true,
            data: orders
        });
    } catch (err) {
        console.error(err);
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching vendor orders"
        });
    }
}

const markdelivered = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.order_id,
            { isDelivered: true },
            { new: true }
        );

        if (!order) {
            return res.status(HTTP.NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(HTTP.SUCCESS).json({
            success: true,
            message: "Order marked as delivered successfully",
            data: order
        });
    } catch (err) {
        console.error(err);
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating delivery status"
        });
    }
}

export default { ordermeal, getuserorders, getvendororders, markdelivered };