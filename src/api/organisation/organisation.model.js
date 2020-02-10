const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const organisationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    active : Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("organisations", organisationSchema);
