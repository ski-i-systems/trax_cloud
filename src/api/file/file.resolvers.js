const { getUserId } = require("../../utils/getUserId");
const { getDateInNumbers } = require("../../utils/getDateInNumbers");

module.exports = {
  Query: {
    //FilesOld: (parent, args, ctx, info) => ctx.models.file.find({}),
    //Files should not expect organisation id to be passed into it, 
    //it should get it from the user who should be logged in at this point.

    Files: async (parent, {data}, {req, models}, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });

      let {documentType, id, creatorId, fields} = data;

      if(user){
        
        if(documentType){
          console.log('documentType', documentType  );
          let mongooseFilter = { organisationID: `${user.organisationID}`, documentType: `${documentType}` };
          return models.file.find(mongooseFilter);
        } else if(fields){
          console.log('fields', fields  );
          //let mongooseFilter = { $and: [{'fields.key' : "Invoice Number"},{'fields.value' : "12347"} ]} ;
          let mongooseFilter = { fields: { $all: [
            //{ "$elemMatch" : { key: "Invoice Number", value: "12347" } },
            { "$elemMatch" : { key: "PO Number", value: "PO-9999" } }
           ]} };



          return models.file.find(mongooseFilter);

        } else {
          return models.file.find({organisationID: user.organisationID});
        }
      }
      else
        throw new Error("Authentication Required");
    },

    File: async (parent, args, {req, models}, info) => { 
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      if(user)
        return models.file.findById(args.id);
      else
        throw new Error("Authentication Required");
    }
  },
  Mutation: {
    createFile: async (parent, args, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      const { documentType } = args.data;

      if (user) {
        const file = await models.file.create({
          creator: userId,
          organisationID : user.organisationID,
          documentType,
          fields: args.fields
        });

        return { file };
      } else if (!user) {
        throw new Error("Authentication Required");
      }
    },
    updateFile: async (parent, args, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      const { _id, data, fields } = args;

      let changesMade = false;
      if (user) {
        let file = await models.file.findOne({ _id: _id });

        if(file.documentType != data.documentType){
          changesMade = true;
          file.documentType = data.documentType;
        }

        fields.forEach(field => {
          let fieldKey = file.fields.find(x => x.key == field.key);

          if(fieldKey === undefined ){
            console.log(`Couldn't find ${field.key} so gonna add it to the file....` );
            changesMade = true;
            file.fields.push(field);
          } else {
            console.log(`Found the field named ${field.key}....` );
            if(fieldKey.value != field.value){
              console.log(`Found the field named ${field.key} and the original value: ${fieldKey.value} and new value: ${field.value}  are different so gonna override it's value....` );
              changesMade = true;
              fieldKey.value = field.value; 
            } else{
              console.log(`Found the field named ${field.key} but the original value: ${fieldKey.value} and new value: ${field.value} are the same so no changes` );
            }
          }
        });

        if(changesMade)
          file = file.save();

        return { file };
      } else{
        throw new Error("Authentication Required");
      }
    },
    
    deleteFile: async (parent, args, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      if(user /* && user.permissions.contains('candeletefiles') later on we will double check here that the user is allowed to delete this file.... */){
        const { id } = args;

        let deleteResponse = await models.file.deleteOne({_id: id});

        let deleteResult = { deleteCount: deleteResponse.deletedCount, success: deleteResponse.ok == 1 && deleteResponse.deletedCount == 1 ? "Success" : "Failed" };

        return deleteResult;
      }
    }
  }
};
