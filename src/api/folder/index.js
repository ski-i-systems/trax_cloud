const { loadGQLFile } = require("../../utils/gqlLoader");
const folderModel = require("./folder.model");
const folderResolvers = require("./folder.resolvers");

module.exports = {
  model: folderModel,
  resolvers: folderResolvers,
  typeDefs: loadGQLFile("folder/folder.graphql")
};
