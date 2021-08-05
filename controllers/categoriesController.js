const Category = require("../models/categories");
const { errorResponse, successResponse } = require("../common/response");
const constants = require("../common/constant");
const categoryService = require("../services/categoryServices");

/* for List Category */
exports.listCategory = async (req, res, next) => {
  try {
    let category = await categoryService.getAllCategory();
    return res
      .status(200)
      .json(successResponse(constants.CATEGORY_LIST, category));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Create Category */
exports.createCategory = async (req, res, next) => {
  try {
    let user_id = req.userId;
    req.body.created_by = user_id;
    let created_cat = await categoryService.creatNewCategory(req.body);
    if (created_cat) {
      return res
        .status(200)
        .json(successResponse(constants.CATEGORY_CREATE_SUCCESS, created_cat));
    }
  } catch (errors) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Update Category */
exports.updateCategory = async (req, res, next) => {
  try {
    const set = req.query.id;
    let user_id = req.userId;
    req.body.updated_by = user_id;

    const Cat = await Category.findOne({ _id: set });
    if (!Cat) {
      return res.status(400).json(errorResponse(constants.CATEGORY_NOT_FOUND));
    }

    let updated_category = await categoryService.updateCategory(set, req.body);
    if (updated_category) {
      return res
        .status(200)
        .json(
          successResponse(constants.CATEGORY_UPDATE_SUCCESS, updated_category)
        );
    }
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for get Category By Id */
exports.getById = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    let category = await categoryService.getAllCategoryById(cat);
    if (!category) {
      return res.status(400).json(errorResponse(constants.CATEGORY_NOT_FOUND));
    }
    res.status(200).json(successResponse(constants.CATEGORY_BY_ID, category));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Delete Category */
exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    const Cat = await Category.findOne({ _id: cat });
    if (!Cat) {
      return res.status(404).json(errorResponse(constants.CATEGORY_NOT_FOUND));
    }

    await categoryService.deleteCategory(cat);
    res
      .status(200)
      .json(successResponse(constants.CATEGORY_DELETE_SUCCESS, Cat));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};
