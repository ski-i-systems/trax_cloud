const { merge } = require("lodash");

const organisation = require("./organisation");
const file = require('./file')
const user = require("./user");
const note = require("./note");

const makeExecutableSchema = () => {
    return {
        typeDefs: [organisation.typeDefs, user.typeDefs, file.typeDefs, note.typeDefs],
        resolvers: merge(
          {},
          user.resolvers,
          organisation.resolvers,
          file.resolvers,
          note.resolvers
        ),
      context: req => ({
        req,
        models: {
            user: user.model,
            organisation: organisation.model,
            file: file.model,
            note: note.model
        }
      })
    }
}
module.exports = {makeExecutableSchema};

