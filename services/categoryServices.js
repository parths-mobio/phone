const Category = require("../models/categories");

/* -------------- MASTER category MODULE ----------- */
/* get all category */
exports.getAllCategory = async () => {
  return await Category.find().populate("created_by", "first_name");
};

exports.creatNewCategory = async (cat) => {
  return await Category.create(cat);
};

exports.getAllCategoryById = async (cat) => {
  return await Category.find({ _id: cat }).populate("created_by", "first_name");
};

/* update Category */
exports.updateCategory = async (cat_id, cat) => {
    let updated_cat;
    updated_cat = await Category.findOneAndUpdate(
      {
        _id: cat_id,
      },
      { $set: cat },
      { new: true }
    );
    return updated_cat;
  };

  /* delete Category */
exports.deleteCategory = async (cat_id) => {
    return Category.deleteOne({ _id: cat_id });
  };
  