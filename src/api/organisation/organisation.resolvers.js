module.exports = {
  Query: {
    Organisations: (parent, args, ctx, info) => ctx.models.organisation.find({})
  },
  Mutation: {
    createOrganisation: async (parent, args, ctx, info) => {
      const { data } = args;

      const organisation = await ctx.models.organisation.create({
        name: data.name
      });

      return { organisation };
    }
  }
};
