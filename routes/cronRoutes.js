const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cronController = require("../controllers/cronController");


router.get(
  "/",
  authController.isSignedIn,
 cronController.setGlimpleOfTheDay
);

module.exports = router;
