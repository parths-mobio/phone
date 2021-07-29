const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("../controllers/authController");

const categoryController = require("../controllers/categoriesController");

router.post(
  "/category/create",
  authController.isSignedIn,
  categoryController.createCategory
);

router.put(
    "/category/update",
    authController.isSignedIn,
    categoryController.updateCategory
);

router.get(
    "/category/listregion",
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