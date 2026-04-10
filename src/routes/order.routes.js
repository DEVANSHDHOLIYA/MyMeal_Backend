import {Router} from 'express';
import auth from '../middleware/authmiddleware.js';
import {orderController} from '../controllers/index.js';
import validate from '../middleware/validationMiddleware.js';
import {stringvalidation} from '../validator/profile.validator.js';

const _Router = Router({
    strict: true,
  mergeParams: true,
  caseSensitive: true,
})

_Router.use(auth);

_Router.route('/addorder').post(validate([stringvalidation('price'),stringvalidation('quantity'),stringvalidation('meal_id'),stringvalidation('total')]),orderController.ordermeal);
export const orderrouter = _Router;