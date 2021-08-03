const Keyword = require("../models/keywords");
const { Validator } = require("node-input-validator");

/* for List Keyword */
exports.listKeyword = async (req, res, next) => {
  try {
    await Keyword.find()
      .populate("created_by", "first_name")
      .exec((err, cat) => {
        if (err || !cat) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "No Keyword Found",
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

/* for Create Keyword */
exports.createKeyword = async (req, res, next) => {
  try {
    let valid = new Validator(req.body, {
      name: "required",
    });
    let matched = await valid.check();
    if (!matched) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: valid.errors,
      });
    }

    let user_id = req.userId;
    const keyword = new Keyword({
      name: req.body.name,
      key: req.body.key,
      value: req.body.value,
      keywords: req.body.keywords,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      created_by: user_id,
    });

    await keyword.save((err, detail) => {
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

/* for Update Keyword */
exports.updateKeyword = async (req, res, next) => {
  try {
    const set = req.query.id;
    let user_id = req.userId;
    req.body.updated_by = user_id;
   
    const Cat = await Keyword.findOne({ _id: set });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No Keyword found",
      });
    }

   
    Keyword.findByIdAndUpdate(
      { _id: set },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, set) => {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "You are not authorized to update this Keyword",
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

/* for get Keyword By Id */
exports.getById = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    await Keyword.findById(cat).exec((err, cat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "No keyword Found",
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

/* for Delete Keyword */
exports.deleteKeyword = async (req, res, next) => {
  try {
    const cat = await req.query.id;

    const Cat = await Keyword.findOne({ _id: cat });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No Keyword found",
      });
    }
    await Keyword.findById(cat).remove((err, deletedcat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "Failed to delete the Keyword",
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
