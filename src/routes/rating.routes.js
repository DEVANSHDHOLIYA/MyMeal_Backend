import { Router } from "express";
import { stringvalidation } from "../validator/profile.validator.js";
import validate from "../middleware/validationMiddleware.js";
import {ratingController} from "../controllers/index.js";
import auth from "../middleware/authmiddleware.js";
import { optionalResourceIds } from "../validator/auth.js";

const _Router = Router({
  strict: true,
  mergeParams: true,
  caseSensitive: true,
});

_Router.use(auth);
_Router
  .route("/giverating")
  .post(
    validate([stringvalidation("rating"), stringvalidation("review")]),
    ratingController.giverating);

_Router
    .route("/getratings/:vendor_id")
    .get(validate([optionalResourceIds("vendor_id", "param")]),ratingController.getratings);

export const ratingrouter = _Router;

