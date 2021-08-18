const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const { errorResponse, successResponse } = require("../common/response");
const constants = require("../common/constant");
const { accountID, authToken, serviceID, COUNTRY_CODE } = require("../config");
const userService = require("../services/userServices");

// This API is for me and parth only
exports.signup = async (req, res, next) => {
  try {
    let user = new User(req.body);
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(user.password, salt);
    if (!hash) throw err;
    user.password = hash;
    let created_user = await userService.creatNewUser(user);
    if (!created_user) {
      return res.status(400).json(errorResponse(constants.USER_NOT_REGISTERED));
    }
    next();
  } catch (errors) {
    res.status(500).json(errorResponse(errors.message));
  }
};

exports.sendOtp = async (req, res) => {
  try {
    if (req.body.phone_number) {
      const data = await userService.sendOtpPhone(req.body.phone_number);
      if (data) {
        return res
          .status(200)
          .json(successResponse(constants.OTP_SEND_SUCCESS, data));
      }
    } else {
      return res
        .status(400)
        .json(errorResponse(constants.OTP_NOT_SEND_SUCCESSFUL, data));
    }
  } catch (errors) {
    res.status(500).json(errorResponse(errors.message));
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    if (req.query.phone_number && req.query.code.length === 6) {
      const data = await userService.verifyOtpPhone(
        req.query.phone_number,
        req.query.code
      );

      if (data.status === "approved") {
        let user_details = await userService.getUserByPhoneNumber(
          req.query.phone_number
        );
        if (!user_details) {
          return res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
        }

        await userService.updateStatus(user_details);

        const token = jwt.sign(
          { _id: user_details._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        return res
          .status(200)
          .json(successResponse(constants.OTP_VERIFY_SUCCESS, token));
      } else {
        return res
          .status(400)
          .json(errorResponse(constants.OTP_NOT_VERIFY_SUCCESSFUL, data));
      }
    } else {
      return res
        .status(400)
        .json(errorResponse(constants.OTP_NOT_VERIFY_SUCCESSFUL, data));
    }
  } catch (errors) {
    res.status(500).json(errorResponse(errors.message));
  }
};

//Sign In api
exports.signin = async (req, res) => {
  try {
    console.log(COUNTRY_CODE);
    const { phone_number, password } = await req.body;

    let user = await userService.getUserByPhoneNumber(phone_number);
    if (!user) {
      res.status(400).json(errorResponse(constants.USER_NOT_FOUND));
    }

    let compare = bcrypt.compare(password, user.password);
    if (!compare) {
      res.status(401).json(errorResponse(constants.PASSWORD_INCORRECT));
    }
    if (!user.is_verified == true) {
      res.status(401).json(errorResponse(constants.USER_NOT_VERIFIED));
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json(successResponse(constants.LOGIN_SUCCESS, token));
  } catch (errors) {
    res.status(500).json(errorResponse(errors.message));
  }
};

//isSigned In Token Middleware
exports.isSignedIn = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json(errorResponse(constants.NO_TOKEN_PROVIDED));
  }
  const bearer = token.split(" ");
  const bearerToken = bearer[1];

  let decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(401).json(errorResponse(constants.INVALID_TOKEN, err.message));
  }
  req.userId = decoded._id;
  next();
};
