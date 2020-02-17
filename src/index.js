const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
// const organisation = require("./api/organisation");
// const file = require("./api/file");
// const lodash = require("lodash");
// const user = require("./api/user");

const {makeExecutableSchema} = require('./api/index');

mongoose.connect("mongodb://127.0.0.1:27017/trax_cloud", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const server = new GraphQLServer(
  
  makeExecutableSchema()
//   {
//   typeDefs: "./src/schema.graphql",
//   resolvers: lodash.merge(
//     {},
//     user.resolvers,
//     organisation.resolvers,
//     file.resolvers
//   ),
//   context:(req)=>{
//     return {
//       req,
//       models: {
//         user: user.model,
//         organisation: organisation.model,
//         file: file.model
//       }
//     };  
// }
);

server.start({ port: 7777 }, () =>
  console.log(`The server is running on port 7777`)
);
