module.exports = {
  Query: {
    Organisations: (parent, args, ctx, info) => {
      console.log("req is " + ctx.req);
      return ctx.models.organisation.find({});
    },
    Organisation: async (parent, args, ctx, info) => {
      const { name } = args;
      return await ctx.models.organisation.findByName({
        name: name
      });

    }
  },
  Mutation: {
    createOrganisation: async (parent, args, ctx, info) => {
      const { data } = args;
      //Below is a static method defined in the organisatin model. It will create a new organisation in the db for us,
      // as well as create an administrator, encrypt his password and return the expected output for graphql.
      let result = await ctx.models.organisation.createNewOrganisation({
        userSchema: ctx.models.user,
        userData: data
      });

      //console.log(test);
      return result;
    }
  }
};
