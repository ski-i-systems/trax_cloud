const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const folderSchema = new Schema(
  {
    organisationID: { type: Schema.Types.ObjectId, ref: "Organisation" },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

folderSchema.statics.createNewFolder = async function(folderDetails) {
  //Declare a model of folder.
  let Folder = mongoose.model("Folder", folderSchema);
  const { name, organisationID } = folderDetails;
  //Create a new folder with data defined by the details passed.

  //organisationId can be garnered from the logged in folder when we are passing it in the request object.
  //Not there at the moment so hardcoding here for the moment

  let folder = new Folder({ name, organisationID, active: true });

  //await hashPassword(password)
  //.then(async hashedPass => {
  //folder.password = hashedPass;
  await folder
    .save()
    .then((fdr) => {
      folder = fdr;
    })
    .catch((err) => {
      throw new Error(err);
    });

  return { folder };
};
folderSchema.statics.findFolder = async (folderId, callback) => {
  console.log('folderId model', folderId);
  const folder = mongoose.model("Folder", folderSchema);
  return await folder.findOne({ _id: folderId }, callback);
};
folderSchema.statics.updateFolder = async (data) => {
  let FolderModel = mongoose.model("Folder", folderSchema);

  console.log("data is", data);

  data = { ...data };
  console.log("data", data);
  return await FolderModel.findByIdAndUpdate(
    { _id: data.id },
    { name: data.name }
  );

  // console.log("folder", folder);

  // return folder;
};

folderSchema.statics.deleteFolder = async (folderId) => {
  //need to think fully about this one to see do we temporarily archive all the folders data and retain for 30days before being completely wiped

  let FolderModel = mongoose.model("Folder", folderSchema);
  let deletedFolder = await FolderModel.findFolder(folderId);
  if (deletedFolder) {
    //update this to updateandremove
    await FolderModel.findByIdAndRemove(folderId, function(err, doc) {
      if (err) return err;

      console.log("doc is : ", doc);
    });
  }
  return deletedFolder;
};

module.exports = mongoose.model("folders", folderSchema);
