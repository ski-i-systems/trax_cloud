const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const NoteSchema = require("../../models/Note");

const FieldSchema = new Schema({ 
  key: String, 
  value: String, 
  dataType: { type:String, default:'string', enum:['string', 'currency', 'datetime', 'integer', 'boolean']} 
});

const fileSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref:"User"},
    // organisation: { type: String, required: true },
    organisationID: { type: Schema.Types.ObjectId, ref: "Organisation" },
    documentType: { type: String },
    fields: [FieldSchema]
    // notes: [NoteSchema]

  },
  { timestamps: true }
);


module.exports = mongoose.model("files", fileSchema);
