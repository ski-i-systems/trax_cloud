const { getUserId } = require("../../utils/getUserId");
ObjectId = require("mongodb").ObjectID;
const CREATE_FOLDER_PROPERTY = "CREATE_FOLDER_PROPERTY";
module.exports = {
  Query: {
    FolderProperties: async (parent, args, ctx, info) => {
      const userId = getUserId(ctx.req);
      const folderID = args;
      const user = await ctx.models.user.findUser(userId);

      if (user) {
        const props = await ctx.models.folderProperty.find({
          folderID: ObjectId(folderID.id),
        });
        return props;
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

        ctx.pubSub.publish(CREATE_FOLDER_PROPERTY, {
          newFolderProperty: folderProperty.folderProperty,
        });
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
        const folderProperty = await ctx.models.folderProperty.deleteFolderProperty(
          data.id
        );
        return { folderProperty };
      }
    },
  },
  Subscription: {
    newFolderProperty: {
      subscribe(parent, args, ctx, info) {
        const { pubSub } = ctx;
        return pubSub.asyncIterator(CREATE_FOLDER_PROPERTY);
      },
    },
  },
};
