import { Router } from "express";
import {userController} from "../controllers/index.js";
import auth from "../middleware/authmiddleware.js";
import validate from "../middleware/validationMiddleware.js";
import { stringvalidation } from "../validator/profile.validator.js";
import { optionalResourceIds } from "../validator/auth.js";

const _Router = Router({
  strict: true,
  mergeParams: true,
  caseSensitive: true,
});

_Router.use(auth);

_Router.route("/get_vendor").post(userController.getvendordata);



_Router
  .route("/getvendorsubscription/:vendor_id")
  .get(
    validate([optionalResourceIds("vendor_id", "param")]),
    userController.getvendorsubscription,
  );

_Router
  .route("/getsubscription")
  .get(userController.getsubscription);

_Router
  .route("/pausesubscription")
  .post(
    validate([stringvalidation("subscription_id")]),
    userController.pausesubscription,
  );
export const userrouter = _Router;
