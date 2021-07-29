const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const { accountID, authToken, serviceID } = require("../config");
const twilioClient = require("twilio")(accountID, authToken);

// This API is for me and parth only
exports.signup = async (req, res, next) => {
  const user = new User(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

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
        next();
      });
    });
  });
};

exports.sendOtp = async (req, res) => {
  if (req.body.phone_number) {
    twilioClient.verify
      .services(serviceID)
      .verifications.create({
        to: `+${req.body.phone_number}`,
        channel: "sms",
      })
      .then((data) => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.body.phone_number,
          data,
        });
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.body.phone_number,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  if (req.query.phone_number && req.query.code.length === 6) {
    twilioClient.verify
      .services(serviceID)
      .verificationChecks.create({
        to: `+${req.query.phone_number}`,
        code: req.query.code,
      })
      .then(async (data) => {
        if (data.status === "approved") {
          console.log(data);
          const user_details = await User.findOne({
            phone_number: req.query.phone_number,
          });

          await user_details.updateOne({
            is_verified: true,
          });
          const token = jwt.sign({ _id: user_details._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });
          res.status(200).send({
            message: "User is Verified!!",
            token,
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
};

//Sign In api
exports.signin = async (req, res) => {
  try {
    const errors = validationResult(req);
    const { phone_number, password } = await req.body;

    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }

    await User.findOne({ phone_number }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: "Error",
          statusCode: 400,
          message: "USER not exists",
        });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({
            status: "Error",
            statusCode: 401,
            message: "Phone_Number or password do not match",
          });
        }
        if (!user.is_verified == true) {
          return res.status(401).json({
            status: "Error",
            statusCode: 401,
            message: "User not Verified",
          });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        const { first_name, phone_number } = user;
        return res.json({
          status: "Success",
          statusCode: 200,
          token,
          message: "SignIn Successfully",
          data: { first_name, phone_number },
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

//isSigned In Token Middleware
exports.isSignedIn = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      Status: "Error",
      statusCode: 403,
      message: "No Token Provided",
    });
  }
  const bearer = token.split(" ");
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        Status: "Error",
        statusCode: 401,
        message: "Invalid Token",
      });
    }
    req.userId = decoded._id;

    next();
  });
};
