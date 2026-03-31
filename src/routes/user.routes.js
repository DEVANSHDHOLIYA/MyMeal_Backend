import { Router } from "express";
import userController from "../controllers/user/user.contoller.js";
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
export const userrouter = _Router;
