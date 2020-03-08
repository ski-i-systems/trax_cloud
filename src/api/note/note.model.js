const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    organisationID: { type: Schema.Types.ObjectId, ref: "Organisation" },
    noteText: { type: String },
    fileId: { type: Schema.Types.ObjectId, ref: "File" }
  },
  { timestamps: true }
);

noteSchema.statics.createNewNote = async noteDetail => {
  let Note = mongoose.model("Note", noteSchema);
  const { userId, organisationID, noteText, fileId } = noteDetail;
  let note = new Note({ userId, organisationID, noteText, fileId });
  await note
    .save()
    .then(nt => {
      note = nt;
    })
    .catch(err => {
      throw new Error(err);
    });

  return note;
};

module.exports = mongoose.model("notes", noteSchema);
