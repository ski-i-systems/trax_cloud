const { merge } = require("lodash");

const organisation = require("./organisation");
const file = require('./file')
const user = require("./user");


const makeExecutableSchema = () => {
    // console.log(organisation);
    // console.log(user);
    // console.log(file);

    return {
        typeDefs: [organisation.typeDefs, user.typeDefs, file.typeDefs],
        //typeDefs: "../schema.graphql",
        resolvers: merge(
          {},
          user.resolvers,
          organisation.resolvers,
          file.resolvers
        ),
      context: req => ({
        req,
        models: {
            user: user.model,
            organisation: organisation.model,
            file: file.model
        }
      })
    }
}
module.exports = {makeExecutableSchema};

