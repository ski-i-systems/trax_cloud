const { loadGQLFile } = require("../../utils/gqlLoader");
const docTypeModel = require("./documentType.model");
const docTypeResolvers = require("./documentType.resolvers");
const { GraphQLUpload } = require('graphql-upload')

module.exports = {
  model: docTypeModel,
  resolvers: docTypeResolvers,
  typeDefs: loadGQLFile("documentType/documentType.graphql")
};
