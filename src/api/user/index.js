const { loadGQLFile } = require("../../utils/gqlLoader");
const userModel = require("./user.model");
const userResolvers = require("./user.resolvers");

module.exports = {
  model: userModel,
  resolvers: userResolvers,
  typeDefs: loadGQLFile("user/user.graphql")
};
