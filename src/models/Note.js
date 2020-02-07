const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = new Schema(
  {
    userId: { type: String, required: true },
    noteText: { type: String },
    fileId: { type: String }
  },
  { timestamps: true }
);

module.exports = { noteSchema };
