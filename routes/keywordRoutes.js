const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const keywordController = require("../controllers/keywordController");

router.post(
  "/keyword/create",
  authController.isSignedIn,
  keywordController.createKeyword
);

router.put(
  "/keyword/update",
  authController.isSignedIn,
  keywordController.updateKeyword
);

router.get(
  "/keyword/list",
  authController.isSignedIn,
  keywordController.listKeyword
);

router.delete(
  "/keyword/delete",
  authController.isSignedIn,
  keywordController.deleteKeyword
);

router.get(
  "/keyword/getKeywordById",
  authController.isSignedIn,
  keywordController.getById
);

module.exports = router;
