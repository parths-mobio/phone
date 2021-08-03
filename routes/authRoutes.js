const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/auth/signup",
  authController.signup,
  authController.sendOtp
);

router.get("/auth/verifyotp", authController.verifyOtp);

router.post(
  "/auth/signin",
  authController.signin
);

module.exports = router;
