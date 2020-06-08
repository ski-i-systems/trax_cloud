const { getUserId } = require("../../utils/getUserId");


module.exports = {
  Query: {
    DocumentType: async (parent, args, {req, models}, info) => { 
        const userId = getUserId(req);
        const user = await models.user.findOne({ _id: userId});
        if(user)
          return models.documentType.findById(args.id);
        else
          throw new Error("Authentication Required");
      },
      DocumentTypes: async (parent, args, {req,models}, info) => {
        const userId = getUserId(req);
        const user = await models.user.findOne({ _id: userId});
        if(user)
          return models.documentType.find({organisationID : user.organisationID });
        else
          throw new Error("Authentication Required");
      }
  },
  Mutation: 
  {
    CreateDocumentType: async(parent, args, {req, models}, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId});
      const { name } = args.data;
      if(user){
        const documentType = await models.documentType.create({
          organisationID : user.organisationID,
          name: name
        });
        
        return { documentType };
      }
      else
        throw new Error("Authentication Required");
    },
    UpdateDocumentType: async(parent, args, {req, models}, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId});
      if(user){
        throw new Error("Unimplemented");
      }
      else
        throw new Error("Authentication Required");
    }
  }
}