const { loadGQLFile } = require("../../utils/gqlLoader");
const noteModel = require("./note.model");
const noteResolvers = require("./note.resolvers");

module.exports = {
  model: noteModel,
  resolvers: noteResolvers,
  typeDefs: loadGQLFile("note/note.graphql")
};
