const { hashPassword } = require("../../utils/hashPassword");
const { generateToken } = require("../../utils/generateToken");
const { getUserId } = require("../../utils/getUserId");
const bcrypt = require("bcryptjs");
module.exports = {
  Query: {
    Greeting: () => `Hello World`,
    Users: (parent, args, ctx, info) => ctx.models.user.find({}),
    usersByOrg: (parent,args,ctx,info) => ctx.models.user.find({organisationID:args.id})
  },
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      const { data } = args;
      const userId = getUserId(ctx.req);

      const user = await ctx.models.user.findUser(userId);
      if (user) {
        const newUser = {
          ...data,
          organisationID: user.organisationID
        };

        const userAndToken = await ctx.models.user.createNewUser(newUser);

        return userAndToken;
      }
    },
    loginUser: async (parent, args, ctx, info) => {
      const { email, password } = args.data;
      const user = await ctx.models.user.findOne({ email: email });

      if (!user) {
        throw new Error("unable to login");
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("unable to login user");
      }
      return {
        user,
        token: generateToken(user.id)
      };
    },
    updateUser: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);

      //TODO Validate permissions here...
      if (userId) {
        return await ctx.models.user.updateUser(data);
      }
    },
    deleteUser: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);
      //Should have a permissions check here along this chain....
      console.log("data is ", data);
      if (userId) {
        return await ctx.models.user.deleteUser(data.id);
      }
    }
  }
};
