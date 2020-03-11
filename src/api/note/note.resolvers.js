const { getUserId } = require("../../utils/getUserId");

module.exports = {
  Query: {
    Notes: (parent, args, ctx, info) => {
      return ctx.modules.notes.find({});
    }
  },
  Mutation: {
    createNote: async (parent, args, ctx, info) => {
      const { data } = args;
      const userId = getUserId(ctx.req);
      const user = await ctx.models.user.findUser(userId);

      if (user) {
        const newNote = {
          ...data,
          userId: user.id,
          organisationID: user.organisationID
        };
        const note = await ctx.models.note.createNewNote(newNote);
        return note;
      }
    }
  }
};
