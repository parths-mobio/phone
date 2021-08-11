const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const keywordController = require("../controllers/keywordController");

router.post(
  "/",
  authController.isSignedIn,
  keywordController.createKeyword
);

router.put(
  "/",
  authController.isSignedIn,
  keywordController.updateKeyword
);

router.get(
  "/",
  authController.isSignedIn,
  keywordController.listKeyword
);

router.delete(
  "/",
  authController.isSignedIn,
  keywordController.deleteKeyword
);

router.get(
  "/getKeywordById",
  authController.isSignedIn,
  keywordController.getById
);

module.exports = router;
