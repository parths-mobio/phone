const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

router.post(
  "/auth/signup",
  [
    check("first_name", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter First Name",
    }).isLength({ min: 3 }),
    check("last_name", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Last Name",
    }).isLength({ min: 2 }),
    check("phone_number", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Phonenumber with at least 10 char",
    }).isLength({ min: 10 }),
    check("password", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter password with at least 8 char",
    }).isLength({ min: 8 }),
  ],
  authController.signup,
  authController.sendOtp
);

router.get("/auth/verifyotp",authController.verifyOtp);

router.post(
  "/auth/signin",
  [
    check("phone_number", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Phonenumber with at least 10 char",
    }).isLength({ min: 10 }),
    check("password", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter password with at least 4 char",
    }).isLength({ min: 4 }),
  ],
  authController.signin
);

module.exports = router;
