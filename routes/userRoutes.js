const express = require("express");
const router = express.Router();
const multer = require("multer");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

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
  "/user/create",
  upload,
  authController.isSignedIn,
  userController.createUser
);

router.put(
  "/user/update",
  upload,
  authController.isSignedIn,
  userController.updateUser
);

router.get("/user/list", authController.isSignedIn, userController.list);

router.delete(
  "/user/delete",
  authController.isSignedIn,
  userController.deleteUser
);

router.get(
  "/user/getUserById",
  authController.isSignedIn,
  userController.getById
);

router.get(
  "/userprofile/list",
  authController.isSignedIn,
  userController.listProfile
);

router.put(
  "/user/updateProfile",
  upload,
  authController.isSignedIn,
  userController.updateUserProfile
);

router.post(
  "/user/updatePhone",
  authController.isSignedIn,
  authController.sendOtp
);

router.get(
  "/user/verifyOtp",
  authController.isSignedIn,
  userController.verifyOtp
);

router.post(
  "/user/updateEmail",
  authController.isSignedIn,
  userController.sendOtpEmail
);

router.post(
  "/user/verifyEmail",
  authController.isSignedIn,
  userController.verifyOtpEmail
);

module.exports = router;
