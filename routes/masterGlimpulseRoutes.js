const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const glimpulseController = require("../controllers/glimpulseController");

router.post(
  "/glimpulse/create",
  authController.isSignedIn,
  glimpulseController.createGlimpulse
);

router.put(
  "/glimpulse/update",
  authController.isSignedIn,
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
