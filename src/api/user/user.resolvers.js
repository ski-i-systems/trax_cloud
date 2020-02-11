const { hashPassword } = require("../../utils/hashPassword");
const { generateToken } = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");

module.exports = {
  Query: {
    Greeting: () => `Hello World`,
    Users: (parent, args, ctx, info) => ctx.models.user.find({})
  },
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      const { data } = args;
      const password = await hashPassword(data.password);
      const { name, email, organisationID } = data;
      const user = await ctx.models.user.create({
        name,
        email,
        password,
        organisationID
      });
      console.log(user);
      return { user, token: generateToken(user.id) };
    },
    createUserSecond: async (parent, args, ctx, info) => {
      const { data } = args;
      const userAndToken = await ctx.models.user.createNewUser(data)
      console.log(userAndToken);
      return userAndToken;
      
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
    updateUser: () => {}
  }
};
