const Category = require("../models/categories");
const { Validator } = require("node-input-validator");

/* for List Category */
exports.listCategory = async (req, res, next) => {
  try {
    await Category.find()
      .populate("created_by", "first_name")
      .exec((err, cat) => {
        if (err || !cat) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "No Category Found",
          });
        }

        res.json({
          status: "Success",
          statusCode: 200,
          message: "Successfully View",
          Data: cat,
        });
      });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      message: err.message,
    });
  }
};

/* for Create Category */
exports.createCategory = async (req, res, next) => {
  try {
    let valid = new Validator(req.body, {
      name: "required",
      category_color: "required",
    });
    var expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);

    if (req.body.url !== undefined) {
      if (!req.body.url.match(regex)) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "Please Enter Proper URL Format",
        });
      }
    }
    let matched = await valid.check();
    if (!matched) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: valid.errors,
      });
    }

    let user_id = req.userId;
    const category = new Category({
      name: req.body.name,
      category_color: req.body.category_color,
      key: req.body.key,
      keywords: req.body.keywords,
      url: req.body.url,
      status: req.body.status,
      tag_of_day: req.body.tag_of_day,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      created_by: user_id,
    });

    await category.save((err, detail) => {
      if (err) {
        //If any error generated when saving the data in DB
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          error: "Not able to save data",
        });
      }

      //Success
      res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Successfully Created",
        data: detail,
      });
    });
  } catch (errors) {
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      message: errors.message,
    });
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
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No Category found",
      });
    }
    var expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);

    if (req.body.url !== undefined) {
      if (!req.body.url.match(regex)) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "Please Enter Proper URL Format",
        });
      }
    }

    Category.findByIdAndUpdate(
      { _id: set },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, set) => {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "You are not authorized to update this Category",
          });
        }

        res.json({
          status: "Success",
          statusCode: 200,
          message: "Successfully Updated",
          data: set,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      message: err.message,
    });
  }
};

/* for get Category By Id */
exports.getById = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    await Category.findById(cat).exec((err, cat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "No category Found",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully View",
        data: cat,
      });
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      message: err.message,
    });
  }
};

/* for Delete Category */
exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    const Cat = await Category.findOne({ _id: cat });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No category found",
      });
    }
    await Category.findById(cat).remove((err, deletedcat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "Failed to delete the Category",
        });
      }
      res.json({
        status: "Success",
        statusCode: 200,
        message: "Successfully deleted",
      });
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      message: err.message,
    });
  }
};
