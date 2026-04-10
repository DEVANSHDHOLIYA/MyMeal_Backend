import { Router } from "express";
import auth from "../middleware/authmiddleware.js";
import { mealController } from "../controllers/index.js";
import { stringvalidation } from "../validator/profile.validator.js";
import validate from "../middleware/validationMiddleware.js";
import uploadFile from '../middleware/multer.js';
import { optionalResourceIds } from "../validator/auth.js";
const _Router = Router({
    strict: true,
  mergeParams: true,
  caseSensitive: true,
})

_Router.use(auth);

_Router.route('/addmeal').post(uploadFile,validate([stringvalidation('items'),stringvalidation('price'),stringvalidation('meal_date'),stringvalidation('mealtime')]),mealController.addmeal);

_Router.route('/getmeals').get(mealController.getmeal);

_Router.route('/getmeals/:vendor_id').get(validate([optionalResourceIds('vendor_id','param')]),mealController.getmeal_user);
export const mealrouter = _Router;