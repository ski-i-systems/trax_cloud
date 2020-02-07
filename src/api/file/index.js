const { loadGQLFile } = require("../../utils/gqlLoader");
const fileModel = require("./file.model");
const fileResolvers = require("./file.resolvers");

module.exports = {
  model: fileModel,
  resolvers: fileResolvers,
  typeDefs: loadGQLFile("file/file.graphql")
};
