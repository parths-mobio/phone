const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const glimpulseController = require("../controllers/glimpulseController");
const { checkSchema } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const glimpulseSchema  = require("../common/validations");

router.post(
  "/glimpulse/create",
  authController.isSignedIn,
  validate(checkSchema(glimpulseSchema.glimpulseSchema)),
  glimpulseController.createGlimpulse
);

router.put(
  "/glimpulse/update",
  authController.isSignedIn,
  validate(checkSchema(glimpulseSchema.updateglimpulseSchema)),
  glimpulseController.updateGlimpulse
);

router.get(
  "/glimpulse/list",
  authController.isSignedIn,
  glimpulseController.listGlimpulse
);

router.delete(
  "/glimpulse/delete",
  authController.isSignedIn,
  glimpulseController.deleteGlimpulse
);

router.get(
  "/glimpulse/getGlimpulseById",
  authController.isSignedIn,
  glimpulseController.getById
);

module.exports = router;
