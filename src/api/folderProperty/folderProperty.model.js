const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const folderPropertySchema = new Schema(
  {
    folderID: { type: Schema.Types.ObjectId, ref: "Folder" },
    organisationID: { type: Schema.Types.ObjectId, ref: "Organisation" },
    name: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

folderPropertySchema.statics.createNewFolderProperty = async function(
  folderPropertyDetails
) {
  //Declare a model of folder.
  let FolderProperty = mongoose.model("FolderProperty", folderPropertySchema);
  const { name, type, organisationID, folderID } = folderPropertyDetails;
  //Create a new folder with data defined by the details passed.

  //organisationId can be garnered from the logged in folder when we are passing it in the request object.
  //Not there at the moment so hardcoding here for the moment

  let folderProperty = new FolderProperty({
    name,
    type,
    organisationID,
    folderID,
  });

  //await hashPassword(password)
  //.then(async hashedPass => {
  //folder.password = hashedPass;
  await folderProperty
    .save()
    .then((fdr) => {
      folderProperty = fdr;
    })
    .catch((err) => {
      throw new Error(err);
    });

  return { folderProperty };
};
folderPropertySchema.statics.findFolderProperty = async (
  folderPropertyId,
  callback
) => {
  const folderProperty = mongoose.model("FolderProperty", folderPropertySchema);
  return folderProperty.findOne({ _id: folderPropertyId }, callback);
};
folderPropertySchema.statics.updateFolderProperty = async (data) => {
  let FolderPropertyModel = mongoose.model(
    "FolderProperty",
    folderPropertySchema
  );

  console.log("data is", data);

  data = { ...data };
  console.log("data", data);
  return await FolderPropertyModel.findByIdAndUpdate(
    { _id: data.id },
    { data }
  );
};

folderPropertySchema.statics.deleteFolderProperty = async (
  folderPropertyId
) => {
  //need to think fully about this one to see do we temporarily archive all the folders data and retain for 30days before being completely wiped

  let FolderPropertyModel = mongoose.model(
    "FolderProperty",
    folderPropertySchema
  );
  let deletedFolderProperty = await FolderPropertyModel.findFolderProperty(
    folderPropertyId
  );
  if (deletedFolderProperty) {
    //update this to updateandremove
    await FolderPropertyModel.findByIdAndRemove(folderPropertyId, function(
      err,
      doc
    ) {
      if (err) return err;

      console.log("doc is : ", doc);
    });
  }
  return deletedFolderProperty;
};

module.exports = mongoose.model("folderProperties", folderPropertySchema);
