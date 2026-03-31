import express from "express";
import auth from "../middleware/authmiddleware.js";
import subscriptionCotroller from "../controllers/vendor/subscription.cotroller.js";
import validate from "../middleware/validationMiddleware.js";
import { optionalResourceIds } from "../validator/auth.js";
const _Router = express.Router({
  strict: true,
  mergeParams: true,
  caseSensitive: true,
});

_Router.use(auth);

_Router
  .route("/vendor/addsubscription")
  .post(subscriptionCotroller.Addsubscription);

_Router
  .route("/vendor/showsubscription")
  .get(subscriptionCotroller.showsubscription);

_Router
  .route("/vendor/updatesubscription")
  .post(subscriptionCotroller.updatesubscription);

_Router
  .route("/getsubscription/:subscription_id")
  .get(
    validate([optionalResourceIds("subscription_id", "param")]),
    subscriptionCotroller.getsubscription,
  );

_Router
  .route("/buysubscription")
  .post(subscriptionCotroller.addusersubscription);

_Router
  .route("/getsubscriberinfo")
  .get(subscriptionCotroller.getsubscriberinfo);

export const subscriptionrouter = _Router;
