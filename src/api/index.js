const { merge } = require("lodash");

const organisation = require("./organisation");
const file = require("./file");
const folderProperty = require("./folderProperty");
const folder = require("./folder");
const user = require("./user");
const note = require("./note");
const { PubSub } = require("graphql-yoga");
const aws = require("./aws");
const pubSub = new PubSub();
const makeExecutableSchema = () => {
  return {
    typeDefs: [
      organisation.typeDefs,
      user.typeDefs,
      file.typeDefs,
      folder.typeDefs,
      folderProperty.typeDefs,
      note.typeDefs,
      aws.typeDefs,
    ],
    resolvers: merge(
      {},
      user.resolvers,
      organisation.resolvers,
      file.resolvers,
      folderProperty.resolvers,
      folder.resolvers,
      note.resolvers,
      aws.resolvers
    ),
    context: (req) => ({
      req,
      models: {
        user: user.model,
        organisation: organisation.model,
        file: file.model,
        note: note.model,
        folderProperty: folderProperty.model,
        folder: folder.model,
      },
      pubSub,
    }),
  };
};
module.exports = { makeExecutableSchema };
