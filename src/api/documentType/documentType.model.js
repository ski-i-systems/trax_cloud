const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const documentTypeSchema = new Schema(
  {
    organisationID : { type: Schema.Types.ObjectId, ref: "Organisation" },
    name: { type: String }
  }
);

module.exports = mongoose.model("documentTypes", documentTypeSchema);