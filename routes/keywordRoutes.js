const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("../controllers/authController");

const keywordController = require("../controllers/keywordController");

router.post(
  "/keyword/create",
  [
    check("name", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Name",
    })
      .notEmpty()
      .isLength({ min: 2 }),
    
  ],
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
