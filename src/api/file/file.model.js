const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fs = require('fs');
const getDateInNumbers = require('../../utils/getDateInNumbers');
const  blobClient = require('@azure/storage-blob');
const uuidv4 = require("uuid").v4;
require('dotenv')
//uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

// const NoteSchema = require("../../models/Note");

const FieldSchema = new Schema({ 
  folderPropertyId:{type:Schema.Types.ObjectId,ref:"FolderProperty"},
  key: String, 
  value: String, 
  dataType: { type:String, default:'string', enum:['string', 'currency', 'datetime', 'integer', 'boolean']} 
});

const fileSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref:"User"},
    organisationID: { type: Schema.Types.ObjectId, ref: "Organisation" },
    folderId: { type: Schema.Types.ObjectId,ref:"Folder" },
    folderFields: [FieldSchema],
    filePath: String,
    storageType:String,
    // notes: [NoteSchema]
    
  },
  { timestamps: true }
);


fileSchema.methods.uploadFileToAzure = async function (input) {
  let {imgPath, orgId, docType} = input;

  let fileName = uuidv4() + imgPath.substring(imgPath.lastIndexOf('.'));
  let data = fs.readFileSync(imgPath);

  const blobServiceClient = await blobClient.BlobServiceClient.fromConnectionString(process.env.storageConnectionString);
  
  let containerName = `${orgId}`;

  const containerClient = await blobServiceClient.getContainerClient(containerName);
  
  if (containerClient.exists() === false){
    containerClient.create()
  }
  const blockBlobClient = containerClient.getBlockBlobClient(`${docType}/` + fileName);

  this.filePath = `${fileName}`;
  
  await blockBlobClient.upload(data, data.length).then( ok => {
      this.save();
    }).catch(err => {
        console.log('err is ', err);
    })
}



module.exports = mongoose.model("files", fileSchema);
