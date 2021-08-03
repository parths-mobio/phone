const { validationResult } = require("express-validator");
const { Validator } = require("node-input-validator");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const { accountID, authToken, serviceID } = require("../config");
const twilioClient = require("twilio")(accountID, authToken);
/* for List User Profile */
exports.listProfile = async (req, res, next) => {
  try {
    let user_id = req.userId;
    await User.find({ _id: user_id })
      .select("first_name")
      .select("last_name")
      .select("phone_number")
      .select("image_id")
      .select("email")
      .exec((err, cat) => {
        if (err || !cat) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "No User Found",
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

/* for List User */
exports.list = async (req, res, next) => {
  try {
    let user_id = req.userId;

    await User.find().exec((err, cat) => {
      if (err || !cat) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "No User Found",
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

/* for Create User */
exports.createUser = async (req, res, next) => {
  try {
    let icon;
    let valid = new Validator(req.body, {
      first_name: "required",
      last_name: "required",
      email: "email",
      phone_number: "required|minLength:10",
      password: "required|minLength:8",
    });
    let matched = await valid.check();
    if (!matched) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: valid.errors,
      });
    }

    if (req.file !== undefined) {
      icon = req.file.filename;
      req.body.image_id = icon;
    }

    //if user entered existing Email
    if (req.body.email !== undefined) {
      const email_old = await User.findOne({ email: req.body.email });
      if (email_old) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          error: "Email Already exists",
        });
      }
    }

    const user = new User(req.body);
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user.save((err, user) => {
          console.log(err);
          if (err) {
            return res.status(400).json({
              Status: "Error",
              statusCode: 400,
              err: "Not able to save User",
            });
          }
          res.json({
            status: "Success",
            statusCode: 200,
            message: "Successfully Created",
            data: user,
          });
        });
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

/* for Update User */
exports.updateUser = async (req, res, next) => {
  try {
    const set = req.query.id;
    const Cat = await User.findOne({ _id: set });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No User found",
      });
    }

    let icon;
    let valid = new Validator(req.body, {
      email: "email",
      phone_number: "minLength:10",
    });
    let matched = await valid.check();
    if (!matched) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: valid.errors,
      });
    }

    if (req.file !== undefined) {
      icon = req.file.filename;
      req.body.image_id = icon;
    }
    if (req.body.email !== undefined) {
      const email_old = await User.findOne({ email: req.body.email });
      if (email_old) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          error: "Email Already exists",
        });
      }
    }

    User.findByIdAndUpdate(
      { _id: set },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, set) => {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "You are not authorized to update this User",
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

/* for get User By Id */
exports.getById = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    await User.findById(cat).exec((err, cat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "No User Found",
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

/* for Delete User */
exports.deleteUser = async (req, res, next) => {
  try {
    const cat = await req.query.id;
    const Cat = await User.findOne({ _id: cat });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No User found",
      });
    }
    await User.findById(cat).remove((err, deletedcat) => {
      if (err) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "Failed to delete the User",
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

/* for List User Profile */
exports.listProfile = async (req, res, next) => {
  try {
    let user_id = req.userId;
    await User.find({ _id: user_id })
      .select("first_name")
      .select("last_name")
      .select("phone_number")
      .select("image_id")
      .select("email")
      .exec((err, cat) => {
        if (err || !cat) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "No User Found",
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

/* for Update User Profile (only for First_name, last_name And Profile pic*/
exports.updateUserProfile = async (req, res, next) => {
  try {
    //const set = req.query.id;
    let user_id = req.userId;

    const Cat = await User.findOne({ _id: user_id });
    if (!Cat) {
      return res.status(400).send({
        status: "Error",
        statusCode: 400,
        message: "No User found",
      });
    }

    if (req.file !== undefined) {
      icon = req.file.filename;
      req.body.image_id = icon;
    }

    User.findByIdAndUpdate(
      { _id: user_id },
      { $set: req.body },
      { new: true, useFindAndModify: false },
      (err, set) => {
        if (err) {
          return res.status(400).json({
            status: "Error",
            statusCode: 400,
            message: "You are not authorized to update this User",
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

exports.verifyOtp = async (req, res) => {
  try {
    let user_id = req.userId;
    if (req.query.phone_number && req.query.code.length === 6) {
      twilioClient.verify
        .services(serviceID)
        .verificationChecks.create({
          to: `+${req.query.phone_number}`,
          code: req.query.code,
        })
        .then(async (data) => {
          if (data.status === "approved") {
           
            const user_details = await User.findOne({
              _id: user_id,
            });

            await user_details.updateOne({
              phone_number: req.query.phone_number,
            });

            res.status(200).send({
              message: "User is Verified!!",
              data,
            });
          } else {
            res.status(400).send({
              message: "Wrong phone number or code :(",
              phonenumber: req.query.phone_number,
              data,
            });
          }
        });
    } else {
      res.status(400).send({
        message: "Wrong phone number or code :(",
        phonenumber: req.query.phone_number,
        data,
      });
    }
  } catch (errors) {
    return res.status(500).json({
      status: "Error",
      statusCode: 500,
      message: errors.message,
    });
  }
};

exports.sendOtpEmail = async (req, res) => {
    try {
      if (req.body.email) {
        twilioClient.verify
          .services(serviceID)
          .verifications.create({
            to: req.body.email,
            channel: "email",
          })
          .then((data) => {
           
            res.status(200).send({
              message: "Verification is sent!!",
              Email: req.body.email,
              data,
            });
          });
      } else {
        res.status(400).send({
          message: "Wrong Email :(",
          Email: req.body.email,
        });
      }
    } catch (errors) {
      return res.status(500).json({
        status: "Error",
        statusCode: 500,
        message: errors.message,
      });
    }
  };

  exports.verifyOtpEmail = async (req, res) => {
    try {
      let user_id = req.userId;
      if (req.body.email && req.body.code.length === 6) {
        twilioClient.verify
          .services(serviceID)
          .verificationChecks.create({
            to: req.body.email,
            code: req.body.code,
          })
          .then(async (data) => {
            if (data.status === "approved") {
             
              const user_details = await User.findOne({
                _id: user_id,
              });
  
              await user_details.updateOne({
                email: req.body.email,
              });
  
              res.status(200).send({
                message: "User is Verified!!",
                data,
              });
            } else {
              res.status(400).send({
                message: "Wrong Email or code :(",
                Email: req.body.email,
                data,
              });
            }
          });
      } else {
        res.status(400).send({
          message: "Wrong Email or code :(",
          Email: req.body.email,
          data,
        });
      }
    } catch (errors) {
      return res.status(500).json({
        status: "Error",
        statusCode: 500,
        message: errors.message,
      });
    }
  };
