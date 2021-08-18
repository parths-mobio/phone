const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const glimpulseController = require("../controllers/glimpulseController");
const { checkSchema } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const glimpulseSchema  = require("../common/validations");

router.post(
  "/",
  authController.isSignedIn,
  validate(checkSchema(glimpulseSchema.glimpulseSchema)),
  glimpulseController.createGlimpulse
);

router.put(
  "/",
  authController.isSignedIn,
  validate(checkSchema(glimpulseSchema.updateglimpulseSchema)),
  glimpulseController.updateGlimpulse
);

router.get(
  "/",
  authController.isSignedIn,
  glimpulseController.listGlimpulse
);

router.delete(
  "/",
  authController.isSignedIn,
  glimpulseController.deleteGlimpulse
);

router.get(
  "/getGlimpulseById",
  authController.isSignedIn,
  glimpulseController.getById
);

module.exports = router;
