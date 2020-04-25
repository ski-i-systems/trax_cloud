const { merge } = require("lodash");

const organisation = require("./organisation");
const file = require("./file");
const folder = require("./folder");
const user = require("./user");
const note = require("./note");
const aws = require("./aws");

const makeExecutableSchema = () => {
  return {
    typeDefs: [
      organisation.typeDefs,
      user.typeDefs,
      file.typeDefs,
      folder.typeDefs,
      note.typeDefs,
      aws.typeDefs,
    ],
    resolvers: merge(
      {},
      user.resolvers,
      organisation.resolvers,
      file.resolvers,
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
        folder: folder.model,
      },
    }),
  };
};
module.exports = { makeExecutableSchema };
