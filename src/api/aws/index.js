const { loadGQLFile } = require("../../utils/gqlLoader");

const awsResolvers = require("./aws.resolvers");
const { GraphQLUpload } = require('graphql-upload')

module.exports = {
//   model: fileModel,
  resolvers: awsResolvers,
  typeDefs: loadGQLFile("aws/aws.graphql")
};
