const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const { checkSchema } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const userSchema  = require("../common/validations");

router.post(
  "/signup",
  validate(checkSchema(userSchema.signUp)),
  authController.signup,
  authController.sendOtp
);

router.get("/verifyotp", authController.verifyOtp);

router.post(
  "/signin",
  validate(checkSchema(userSchema.signIn)),
  authController.signin
);

module.exports = router;
