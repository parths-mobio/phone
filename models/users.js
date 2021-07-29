const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    phone_number: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
    },
    dob: {
      type: Date,
    },
    image_id: {
      type: String,
    },
    password: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_block: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    total_created_glimples: {
      type: Number,
      default: 0,
    },
    login_activity: [
      {
        is_login: Boolean,
        device_info: Object,
        logout_time: Date,
        created_at: Date,
      },
    ],
    settings: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);