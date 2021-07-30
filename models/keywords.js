const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const keywordsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
    },
    value: {
      type: String,
    },
    keywords: [String],
    status: {
      type: Boolean,
      default: false,
    },
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

module.exports = mongoose.model("Keyword", keywordsSchema);
