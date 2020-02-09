const { getUserId } = require("../../utils/getUserId");
module.exports = {
  Query: {
    Files: (parent, args, ctx, info) => ctx.models.file.find({})
  },
  Mutation: {
    createFile: async (parent, args, { req, models }, info) => {
      console.log("args", args);
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      const { organisation, documentType } = args.data;

      if (user) {
        const file = await models.file.create({
          creator: userId,
          organisation,
          documentType,
          fields: args.fields
        });

        return { file };
      } else if (!user) {
        throw new Error("Authentication Required");
      }
    }
  }
};
