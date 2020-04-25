const { loadGQLFile } = require("../../utils/gqlLoader");
const folderPropertyModel = require("./folderProperty.model")
const folderPropertyResolvers = require("./folderProperty.resolvers");

module.exports = {
  model: folderPropertyModel,
  resolvers: folderPropertyResolvers,
  typeDefs: loadGQLFile("folderProperty/folderProperty.graphql"),
};
