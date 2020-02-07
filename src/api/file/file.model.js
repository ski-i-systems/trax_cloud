const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NoteSchema = require("../../models/Note");

const FieldSchema = new Schema({ key: String, value: String });
const fileSchema = new Schema(
  {
    creator: { type: String, required: true },
    organisation: { type: String, required: true },
    documentType: { type: String },
    fields: [FieldSchema],
    notes: [NoteSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("files", fileSchema);
