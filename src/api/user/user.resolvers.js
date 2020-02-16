const { hashPassword } = require("../../utils/hashPassword");
const { generateToken } = require("../../utils/generateToken");
const { getUserId } = require("../../utils/getUserId");
const bcrypt = require("bcryptjs");
module.exports = {
  Query: {
    Greeting: () => `Hello World`,
    Users: (parent, args, ctx, info) => ctx.models.user.find({})
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
      const { data } = args;

      const userId = getUserId(ctx.req);

      if (userId) {
        await ctx.models.user.findOneAndUpdate(
          userId,
          data,
          { upsert: false },
          function(err, doc) {
            if (err) return err;
          }
        );
      }
      return await ctx.models.user.findUser(userId);
    }
  }
};
