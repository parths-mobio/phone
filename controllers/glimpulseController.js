const Glimpulse = require("../models/master_glimpulses");
const { Validator } = require("node-input-validator");

/* for List Glimpulse */
exports.listGlimpulse = async (req, res, next) => {
  try {
    await Glimpulse.find()
      .populate("keywords", "name")
      .populate("category_id", "name url")
      .populate("created_by", "first_name")
      .exec((err, cat) => {
        if (err || !cat) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "No Glimpulse Found",
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

/* for Create Glimpulse */
exports.createGlimpulse = async (req, res, next) => {
  try {
    let valid = new Validator(req.body, {
      title: "required",
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
    req.body.created_by = user_id;
    const glimpulse = new Glimpulse(req.body);
    

    await glimpulse.save((err, detail) => {
      if (err) {
        console.log(err);
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

/* for Update Glimpulse */
exports.updateGlimpulse = async (req, res, next) => {
  try {
    const set = req.query.id;
    let user_id = req.userId;
    req.body.updated_by = user_id;

    const Cat = await Glimpulse.findOne({ _id: set });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No Glimpulse found",
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

    Glimpulse.findByIdAndUpdate(
      { _id: set },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, set) => {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "You are not authorized to update this Glimpulse",
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

/* for get Glimpulse By Id */
exports.getById = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    await Glimpulse.findById(cat)
      .populate("keywords", "name")
      .populate("category_id", "name url")
      .populate("created_by", "first_name")
      .exec((err, cat) => {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "No Glimpulse Found",
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

/* for Delete Glimpulse */
exports.deleteGlimpulse = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    const Cat = await Glimpulse.findOne({ _id: cat });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No Glimpulse found",
      });
    }
    await Glimpulse.findById(cat).remove((err, deletedcat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "Failed to delete the Glimpulse",
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
