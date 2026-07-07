import { Router } from "express";
import auth from "../middleware/authmiddleware.js";
import { mealController } from "../controllers/index.js";
import { stringvalidation } from "../validator/profile.validator.js";
import validate from "../middleware/validationMiddleware.js";
import { mealPhotos } from "../middleware/multer.js"; 
import { optionalResourceIds } from "../validator/auth.js";
const _Router = Router({
    strict: true,
  mergeParams: true,
  caseSensitive: true,
})

_Router.use(auth);

_Router.route('/addmeal').post(mealPhotos,validate([stringvalidation('primary_meal'),stringvalidation('price'),stringvalidation('meal_date'),stringvalidation('mealtime')]),mealController.addmeal);

_Router.route('/getmeals').get(mealController.getmeal);
_Router.route('/getsubscriptionmeal').get(mealController.subscriptionmeal);

_Router.route('/getmeals/:vendor_id').get(validate([optionalResourceIds('vendor_id','param')]),mealController.getmeal_user);

_Router.route('/mealbuydata/:meal_id').get(validate([optionalResourceIds('meal_id','param')]),mealController.mealbuydata);
export const mealrouter = _Router;