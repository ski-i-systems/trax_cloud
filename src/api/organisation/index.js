const { loadGQLFile } = require("../../utils/gqlLoader");
const organisationModel = require("./organisation.model");
const organisationResolvers = require("./organisation.resolvers");

module.exports = {
  model: organisationModel,
  resolvers: organisationResolvers,
  typeDefs: loadGQLFile("organisation/organisation.graphql")
};
