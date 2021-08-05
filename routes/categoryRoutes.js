const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoriesController");
const { validate } = require("../middleware/validate.middleware");
const categorySchema  = require("../common/validations");


router.post(
  "/category/create",
  authController.isSignedIn,
  validate(checkSchema(categorySchema.categorySchema)),
  categoryController.createCategory
);

router.put(
  "/category/update",
  authController.isSignedIn,
  validate(checkSchema(categorySchema.updatecategorySchema)),
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
