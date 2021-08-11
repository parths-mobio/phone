const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { checkSchema } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const userSchema  = require("../common/validations");


var storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image_id", 5);

router.post(
  "/",
  upload,
  authController.isSignedIn,
  validate(checkSchema(userSchema.userSchema)),
  userController.createUser
);

router.put(
  "/",
  upload,
  authController.isSignedIn,
  userController.updateUser
);

router.get("/", authController.isSignedIn, userController.list);

router.delete(
  "/",
  authController.isSignedIn,
  userController.deleteUser
);

router.get(
  "/getUserById",
  authController.isSignedIn,
  userController.getById
);

router.get(
  "/userprofile",
  authController.isSignedIn,
  userController.listProfile
);

router.put(
  "/updateProfile",
  upload,
  authController.isSignedIn,
  userController.updateUserProfile
);

router.post(
  "/updatePhone",
  authController.isSignedIn,
  authController.sendOtp
);

router.get(
  "/verifyOtp",
  authController.isSignedIn,
  userController.verifyOtp
);

router.post(
  "/updateEmail",
  authController.isSignedIn,
  userController.sendOtpEmail
);

router.post(
  "/verifyEmail",
  authController.isSignedIn,
  userController.verifyOtpEmail
);

router.put(
  "/changepassword",
  authController.isSignedIn,
  validate(checkSchema(userSchema.changepasswordSchema)),
  userController.changepassword
)

module.exports = router;
