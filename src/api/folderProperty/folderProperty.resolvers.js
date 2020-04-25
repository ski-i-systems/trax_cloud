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
    FolderProperties: async (parent, args, ctx, info) => {
      const userId = getUserId(ctx.req);
      const { folderID } = args.data;
      console.log('folderID', folderID);
      const user = await ctx.models.user.findUser(userId);
      const { organistionID } = user;
      console.log('organistionID', organistionID);
      if (user) {
        return ctx.models.folderProperty.find({ folderID, organistionID });
      }
    },
    //usersByOrg: (parent,args,ctx,info) => ctx.models.user.find({organisationID:args.id})
  },
  Mutation: {
    createFolderProperty: async (parent, args, ctx, info) => {
      const { data } = args;
      console.log("data", data);
      const userId = getUserId(ctx.req);

      const user = await ctx.models.user.findUser(userId);
      console.log("user", user);

      if (user) {
        const newFolderProperty = {
          ...data,
          organisationID: user.organisationID,
        };

        const folderProperty = await ctx.models.folderProperty.createNewFolderProperty(
          newFolderProperty
        );
        console.log("folder", folderProperty);

        return folderProperty;
      }
    },

    updateFolderProperty: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);

      //TODO Validate permissions here...
      if (userId) {
        const folder = await ctx.models.folder.updateFolder(data);

        return { folder };
      }
    },
    deleteFolderProperty: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);
      //Should have a permissions check here along this chain....

      if (userId) {
        const folderProperty = await ctx.models.folderProperty.deleteFolderProperty(data.id);
        return { folderProperty };
      }
    },
  },
};
