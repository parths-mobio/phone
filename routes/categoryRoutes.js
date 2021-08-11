const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoriesController");
const { validate } = require("../middleware/validate.middleware");
const categorySchema  = require("../common/validations");


router.post(
  "/",
  authController.isSignedIn,
  validate(checkSchema(categorySchema.categorySchema)),
  categoryController.createCategory
);

router.put(
  "/",
  authController.isSignedIn,
  validate(checkSchema(categorySchema.updatecategorySchema)),
  categoryController.updateCategory
);

router.get(
  "/",
  authController.isSignedIn,
  categoryController.listCategory
);

router.delete(
  "/",
  authController.isSignedIn,
  categoryController.deleteCategory
);

router.get(
  "/getCategoryById",
  authController.isSignedIn,
  categoryController.getById
);

module.exports = router;
