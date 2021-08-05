const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const masterGlimpulseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    glimple_of_day: {
      type: Boolean,
      default: false,
    },
    identifier: {
      type: String,
    },
    have_web: {
      type: String,
      default: 1,
    },
    is_new: {
      type: Boolean,
      default: false,
    },
    is_popular: {
      type: Boolean,
      default: false,
    },
    public_id: {
      type: String,
    },
    keywords: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Keyword",
      },
    ],
    sort_order: {
      type: Number,
    },
    url: {
      type: String,
    },
    total_created_glimpulses: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: false,
    },
    category_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterGlimpulse", masterGlimpulseSchema);
