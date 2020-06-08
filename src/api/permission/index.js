const { loadGQLFile } = require("../../utils/gqlLoader");
const permissionModel = require("./permission.model");
const permissionResolvers = require("./permission.resolvers");

module.exports = {
  model: permissionModel,
  resolvers: permissionResolvers,
  typeDefs: loadGQLFile("permission/permission.graphql")
};
