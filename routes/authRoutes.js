const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/signup",
  authController.signup,
  authController.sendOtp
);

router.get("/verifyotp", authController.verifyOtp);

router.post(
  "/signin",
  authController.signin
);

module.exports = router;
