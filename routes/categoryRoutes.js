const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("../controllers/authController");

const categoryController = require("../controllers/categoriesController");

router.post(
  "/category/create",
  [
    check("name", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Name",
    })
      .notEmpty()
      .isLength({ min: 2 }),
    check("category_color", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Color",
    }).notEmpty(),
    check("url", {
      Status: "Error",
      Statuscode: 400,
      message: "Please Enter Proper URL Format",
    }).isURL({ protocols: ["https"] }),
  ],
  authController.isSignedIn,
  categoryController.createCategory
);

router.put(
  "/category/update",
  authController.isSignedIn,
  categoryController.updateCategory
);

router.get(
  "/category/list",
  authController.isSignedIn,
  categoryController.listCategory
);

router.delete(
  "/category/delete",
  authController.isSignedIn,
  categoryController.deleteCategory
);

router.get(
  "/category/getCategoryById",
  authController.isSignedIn,
  categoryController.getById
);

module.exports = router;
