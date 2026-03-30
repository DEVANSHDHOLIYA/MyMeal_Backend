import express, { Router } from "express";
import { authController } from "../controllers/index.js";
import validate from "../middleware/validationMiddleware.js";
import {
  emailValidation,
  passwordvalidation,
  nameValidation,
  phonenovalidation,
  companynameValidation,
} from "../validator/auth.js";

const _Router = express.Router({
  strict: true,
  mergeParams: true,
  caseSensitive: true,
});

_Router
  .route("/user/register")
  .post(
    validate([nameValidation(), emailValidation(), passwordvalidation()]),
    authController.signup,
  );

_Router
  .route("/user/login")
  .post(
    validate([emailValidation(), passwordvalidation()]),
    authController.login,
  );

_Router
  .route("/vendor/register")
  .post(
    validate([
      nameValidation(),
      emailValidation(),
      passwordvalidation(),
      phonenovalidation(),
      companynameValidation(),
    ]),
    authController.vendorsignup,
  );

_Router
  .route("/vendor/login")
  .post(
    validate([emailValidation(), passwordvalidation()]),
    authController.vendorlogin,
  );

_Router
  .route("/user/verify_otp")
  .post(validate([emailValidation()]), authController.VerifyOTP);

_Router
  .route("/vendor/verify_otp")
  .post(validate([emailValidation()]), authController.vendorVerifyOTP);

_Router
  .route("/user/resend_otp")
  .post(validate([emailValidation()]), authController.Resendotp);

_Router
  .route("/user/resetpassword")
  .post(validate([emailValidation()]), authController.resetpassword);

_Router
  .route("/user/changepassword")
  .post(validate([passwordvalidation()]), authController.changepassword);

_Router
  .route("/vendor/resetpassword")
  .post(validate([emailValidation()]), authController.vendorresetpassword);

_Router
  .route("/vendor/changepassword")
  .post(validate([passwordvalidation()]), authController.vendorchangepassword);

export const authRoute = _Router;
