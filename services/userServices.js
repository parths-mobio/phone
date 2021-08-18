const User = require("../models/users");
const { accountID, authToken, serviceID } = require("../config");
const twilioClient = require("twilio")(accountID, authToken);

/* -------------- MASTER category MODULE ----------- */

/* get all User */
exports.getAllUser = async () => {
  return await User.find();
};

/* Create New User */
exports.creatNewUser = async (cat) => {
  return await User.create(cat);
};

/* get User By Id */
exports.getAllUserById = async (cat) => {
  return await User.find({ _id: cat });
};

/* update User */
exports.updateUser = async (cat_id, cat) => {
  let updated_cat;
  updated_cat = await User.findOneAndUpdate(
    {
      _id: cat_id,
    },
    { $set: cat },
    { new: true }
  );
  return updated_cat;
};

/* delete User */
exports.deleteUser = async (cat_id) => {
  return User.deleteOne({ _id: cat_id });
};

/* Get User By Email */
exports.getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

/* Get User By Phone */
exports.getUserByPhoneNumber = async (phone_number) => {
  return await User.findOne({ phone_number: phone_number });
};

/* Changepassword */
exports.changePassword = async (user, hash_password) => {
  const update_password = await user[0].updateOne({
    password: hash_password,
  });

  return update_password;
};

/* Get Profile */
exports.getProfile = async (user_id) => {
  return await User.find({ _id: user_id })
    .select("first_name")
    .select("last_name")
    .select("phone_number")
    .select("image_id")
    .select("email");
};

/* Update Phone */
exports.updatePhone = async (user, phone) => {
  const update_phone = await user[0].updateOne({
    phone_number: phone,
  });

  return update_phone;
};

/* Update Email */
exports.updateEmail = async (user, email_id) => {
  const update_email = await user[0].updateOne({
    email: email_id,
  });

  return update_email;
};

/* Verify Otp Phone */
exports.verifyOtpPhone = async (phone_number, code) => {
  const data = await twilioClient.verify
    .services(serviceID)
    .verificationChecks.create({
      to: `+91${phone_number}`,
      code: code,
    })
    .then((data) => {
      return data;
    });
  return data;
};

/* Send Otp Email */
exports.sendOtpEmail = async (email_id) => {
  const data = await twilioClient.verify
    .services(serviceID)
    .verifications.create({
      to: email_id,
      channel: "email",
    })
    .then((data) => {
      return data;
    });
  return data;
};

/* Verify Otp Email */
exports.verifyOtpEmail = async (email_id, code) => {
  const data = await twilioClient.verify
    .services(serviceID)
    .verificationChecks.create({
      to: email_id,
      code: code,
    })
    .then((data) => {
      return data;
    });
  return data;
};

/* Send Otp Phone */
exports.sendOtpPhone = async (phone_number) => {
  const data = await twilioClient.verify
    .services(serviceID)
    .verifications.create({
      to: `+91${phone_number}`,
      channel: "sms",
    })
    .then((data) => {
      return data;
    });
  return data;
};

/* Update Status */
exports.updateStatus = async (user) => {
  const update_status = await user.updateOne({
    is_verified: true,
  });

  return update_status;
};
