const { getUserId } = require("../../utils/getUserId");
module.exports = {
  Query: {
    //Get a single user by id, email or name
    //If it's by name, as it's not unique, the name should be accompanied by the users organisationId
    // Folder: async (parent, args, ctx, info) => {
    //   return {
    //     id: "12312",
    //     name: "test",
    //   };
    // let { data } = args;
    // let { id, name } = data;
    // let folder;

    //   const userId = getUserId(ctx.req);
    //   user = await ctx.models.user.findUser(userId);

    // let query;
    // if (id) {
    //   //Don't need organisation id here for the moment....
    //   query = { /*organisationID: user.organisationID,*/ _id: id };
    // } else if (email) {
    //   query = {
    //     /*organisationID: user.organisationID, */ email: email.toLowerCase()
    //   };
    // } else if (name && user !== undefined) {
    //   query = { organisationID: user.organisationID, name: name };
    // }

    // return ctx.models.user.findOne(query);
    // },
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
    //usersByOrg: (parent,args,ctx,info) => ctx.models.user.find({organisationID:args.id})
  },
  Mutation: {
    createFolder: async (parent, args, ctx, info) => {
      const { data } = args;
      console.log("data", data);
      const userId = getUserId(ctx.req);

      const user = await ctx.models.user.findUser(userId);
      console.log("user", user);

      if (user) {
        const newFolder = {
          ...data,
          organisationID: user.organisationID,
        };

        const folder = await ctx.models.folder.createNewFolder(newFolder);
        console.log("folder", folder);

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
