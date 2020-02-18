const { getUserId } = require("../../utils/getUserId");

module.exports = {
  Query: {
    FilesOld: (parent, args, ctx, info) => ctx.models.file.find({}),
    Files: (parent, args, ctx, info) => ctx.models.file.find({organisationID: args.organisationID})
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

      if (user) {
        const file = await models.file.findOne({ _id: _id });
        console.log("file", file);
        const updatedFile = {
          ...file
          //documentType: data.documentType
        };
        console.log("updated file", updatedFile);
        return { updatedFile };
      }
    }
  }
};
