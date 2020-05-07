const { getUserId } = require("../../utils/getUserId");
module.exports = {
  Query: {

    Folders: async (parent, args, ctx, info) => {
      const userId = getUserId(ctx.req);
      const user = await ctx.models.user.findUser(userId);

      if (user) {
        return ctx.models.folder.find({});
      }
    },
    Folder: async (parent, args, ctx, info) => {
      const folderId = args;

      const userId = getUserId(ctx.req);
      const user = await ctx.models.user.findUser(userId);

      if (user) {
        const folder = await ctx.models.folder.findFolder(folderId.id);
        return folder;
      }
    },
  },
  Mutation: {
    createFolder: async (parent, args, ctx, info) => {
      const { data } = args;
     
      const userId = getUserId(ctx.req);

      const user = await ctx.models.user.findUser(userId);
   

      if (user) {
        const newFolder = {
          ...data,
          organisationID: user.organisationID,
        };

        const folder = await ctx.models.folder.createNewFolder(newFolder);
    

        return folder;
      }
    },

    updateFolder: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);

      //TODO Validate permissions here...
      if (userId) {
        const folder = await ctx.models.folder.updateFolder(data);

        return { folder };
      }
    },
    deleteFolder: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);
      //Should have a permissions check here along this chain....

      if (userId) {
        const folder = await ctx.models.folder.deleteFolder(data.id);
        return { folder };
      }
    },
  },
};
