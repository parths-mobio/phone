const userService = require("../services/userServices");
const { errorResponse, successResponse } = require("../common/response");
const constants = require("../common/constant");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const { accountID, authToken, serviceID } = require("../config");
const { USER_NOT_VERIFIED } = require("../common/constant");
const twilioClient = require("twilio")(accountID, authToken);

/* for List User */
exports.list = async (req, res, next) => {
  try {
    let user = await userService.getAllUser();
    return res.status(200).json(successResponse(constants.USER_LIST, user));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Create User */
exports.createUser = async (req, res, next) => {
  try {
    let icon;

    let already_exist1 = await userService.getUserByPhoneNumber(
      req.body.phone_number
    );
    if (already_exist1) {
      return res.status(400).json(errorResponse(constants.USER_ALREADY_EXIST));
    }

    if (req.file !== undefined) {
      icon = req.file.filename;
      req.body.image_id = icon;
    }

    //if user entered existing Email
    if (req.body.email !== undefined) {
      let already_exist = await userService.getUserByEmail(req.body.email);
      if (already_exist) {
        return res
          .status(400)
          .json(errorResponse(constants.USER_ALREADY_EXIST));
      }
    }

    bcrypt.genSalt(10, async (err, salt) => {
      if (err) throw err;
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) throw err;
        req.body.password = hash;
        let created_user = await userService.creatNewUser(req.body);
        if (created_user) {
          return res
            .status(200)
            .json(successResponse(constants.USER_CREATE_SUCCESS, created_user));
        }
      });
    });
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Update User */
exports.updateUser = async (req, res, next) => {
  try {
    const set = req.query.id;
    let icon;
    let user = await userService.getAllUserById(set);
    if (!user) {
      return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
    }
    if (req.body.phone_number !== undefined) {
      let already_exist1 = await userService.getUserByPhoneNumber(
        req.body.phone_number
      );
      if (already_exist1) {
        return res
          .status(400)
          .json(errorResponse(constants.USER_ALREADY_EXIST));
      }
    }

    if (req.file !== undefined) {
      icon = req.file.filename;
      req.body.image_id = icon;
    }
    if (req.body.email !== undefined) {
      let already_exist = await userService.getUserByEmail(req.body.email);
      if (already_exist) {
        return res
          .status(400)
          .json(errorResponse(constants.USER_ALREADY_EXIST));
      }
    }

    let updated_user = await userService.updateUser(set, req.body);
    if (updated_user) {
      return res
        .status(200)
        .json(successResponse(constants.USER_UPDATE_SUCCESS, updated_user));
    }
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for get User By Id */
exports.getById = async (req, res, next) => {
  try {
    const user_id = await req.query.id;
    let user = await userService.getAllUserById(user_id);
    if (!user) {
      return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
    }
    res.status(200).json(successResponse(constants.USER_BY_ID, user));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Delete User */
exports.deleteUser = async (req, res, next) => {
  try {
    const user_id = await req.query.id;
    let user = await userService.getAllUserById(user_id);
    if (!user) {
      return res.status(404).json(errorResponse(constants.USER_NOT_FOUND));
    }

    await userService.deleteUser(user);
    res.status(200).json(successResponse(constants.USER_DELETE_SUCCESS, user));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* change Password */

exports.changepassword = async (req, res, next) => {
  try {
    let user_id = req.userId;
    let user = await userService.getAllUserById(user_id);

    if (!user) {
      return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
    }

    let compare = await bcrypt.compare(req.body.old_password, user[0].password);

    if (!compare) {
      return res.status(400).json(errorResponse(constants.PASSWORD_INCORRECT));
    }

    let hash_pass = await bcrypt.hashSync(req.body.new_password, 10);
    
    let update_password = await userService.changePassword(user, hash_pass);

    if (!update_password) {
      return res
        .status(400)
        .json(errorResponse(constants.PASSWORD_NOT_UPDATED_SUCCESSFULLY));
    }
    res.status(200).json(successResponse(constants.PASSWORD_UPDATE_SUCCESS));
  } catch (e) {
    res.status(500).json(errorResponse(e.message));
  }
};

/* for List User Profile */
exports.listProfile = async (req, res, next) => {
  try {
    let user_id = req.userId;
    let user_data = await userService.getProfile(user_id);
    if (!user_data) {
      return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
    }
    res.status(200).json(successResponse(constants.USER_BY_ID, user_data));
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* for Update User Profile (only for First_name, last_name And Profile pic*/
exports.updateUserProfile = async (req, res, next) => {
  try {
    let user_id = req.userId;
    
    let user = await userService.getAllUserById(user_id);
    if (!user) {
      return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
    }

    if (req.file !== undefined) {
      icon = req.file.filename;
      req.body.image_id = icon;
    }

    let updated_user = await userService.updateUser(user_id, req.body);
    if (updated_user) {
      return res
        .status(200)
        .json(successResponse(constants.USER_UPDATE_SUCCESS, updated_user));
    }
  } catch (err) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* Verfy OTP */
exports.verifyOtp = async (req, res) => {
  try {
    let user_id = req.userId;
    if (req.query.phone_number && req.query.code.length === 6) {
      const data = await userService.verifyOtpPhone(
        req.query.phone_number,
        req.query.code
      );
      if (data.status === "approved") {
       
        let user_details = await userService.getAllUserById(user_id);
        if (!user_details) {
          return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
        }
        await userService.updatePhone(user_details, req.query.phone_number);
        return res
          .status(200)
          .json(successResponse(constants.OTP_VERIFY_SUCCESS, data));
      } else {
        return res
          .status(400)
          .json(errorResponse(constants.CHECK_PHONE_OTP, data));
      }
    } else {
      return res
        .status(400)
        .json(errorResponse(constants.CHECK_PHONE_OTP, data));
    }
  } catch (errors) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* Send OTP Email */
exports.sendOtpEmail = async (req, res) => {
  try {
    if (req.body.email) {
      const data = await userService.sendOtpEmail(req.body.email);
      if (data) {
        return res
          .status(200)
          .json(successResponse(constants.OTP_VERIFY_SUCCESS, data));
      }
    } else {
      return res
        .status(400)
        .json(successResponse(constants.OTP_NOT_SEND_SUCCESSFUL, data));
    }
  } catch (errors) {
    res.status(500).json(errorResponse(err.message));
  }
};

/* Verfy OTP Email */
exports.verifyOtpEmail = async (req, res) => {
  try {
    let user_id = req.userId;
    if (req.body.email && req.body.code.length === 6) {
      const data = await userService.verifyOtpEmail(
        req.body.email,
        req.body.code
      );

      if (data.status === "approved") {
       
        let user_details = await userService.getAllUserById(user_id);
        await userService.updateEmail(user_details, req.body.email);

        return res
          .status(200)
          .json(successResponse(constants.OTP_VERIFY_SUCCESS, data));
      } else {
        return res
          .status(400)
          .json(successResponse(constants.OTP_NOT_VERIFY_SUCCESSFUL, data));
      }
    } else {
      return res
        .status(400)
        .json(successResponse(constants.OTP_NOT_VERIFY_SUCCESSFUL, data));
    }
  } catch (errors) {
    res.status(500).json(errorResponse(errors.message));
  }
};
