import {Router} from 'express';
import auth from '../middleware/authmiddleware.js';
import profileController from '../controllers/profile.controller.js';
import {companynameValidation, emailValidation, nameValidation, phonenovalidation } from '../validator/auth.js';
import validate from '../middleware/validationMiddleware.js';
import {stringvalidation} from '../validator/profile.validator.js';
const _Router = Router({
    strict: true,
  mergeParams: true,
  caseSensitive: true,
})

_Router.use(auth)

_Router.route('/get_profile').post(profileController.profile);

_Router.route('/update_profile').post(validate([nameValidation(),phonenovalidation(),stringvalidation('address'),stringvalidation('city'),stringvalidation('state'),stringvalidation('country')]),profileController.profileupdate);

_Router.route('/vendor/get_profile').post(profileController.vendor_profile);

_Router.route('/vendor/update_profile').post(validate([nameValidation(),phonenovalidation(),companynameValidation(),stringvalidation('address'),stringvalidation('city'),stringvalidation('state'),stringvalidation('country')]),profileController.vendor_profileupdate);
export const profilerouter=_Router;
