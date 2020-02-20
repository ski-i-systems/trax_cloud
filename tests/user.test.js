require("cross-fetch/polyfill");
const ApolloBoost = require("apollo-boost").default;
const { gql } = require("apollo-boost");
const mongoose = require("mongoose");

const client = new ApolloBoost({
  uri: "http://localhost:7777"
});

beforeEach(async function(done) {
  /*
      Define clearDB function that will loop through all 
      the collections in our mongoose connection and drop them.
    */

  async function clearDB() {
    const collections = await mongoose.connection.db.collections();

    for (var i in collections) {
      await collections[i].deleteMany({});
    }
    // for (var i in mongoose.connection.collections) {
    //   mongoose.connection.collections[i].remove(function() {});
    // }
    return done();
  }

  /*
      If the mongoose connection is closed, 
      start it up using the test url and database name
      provided by the node runtime ENV
    */
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(
      "mongodb://127.0.0.1:27017/trax_cloud",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      },
      function(err) {
        if (err) {
          throw err;
        }
        return clearDB();
      }
    );
  } else {
    return clearDB();
  }
});

afterEach(function(done) {
  mongoose.disconnect();
  return done();
});

afterAll(done => {
  return done();
});

test("should create organisation with user", async () => {
  const createOrg = gql`
    mutation {
      createOrganisation(
        data: {
          name: "Paul Ltd"
          adminName: "PaulMc"
          adminEmail: "Paulmc@paulltd.ie"
          adminPassword: "12345678"
        }
      ) {
        organisation {
          name
          createdAt
        }
        adminUser {
          name
          email
        }
      }
    }
  `;
  const response = await client.mutate({
    mutation: createOrg
  });
 
  expect(response.data.createOrganisation.organisation.name).toBe("Paul Ltd");
  expect(response.data.createOrganisation.adminUser.email).toBe("paulmc@paulltd.ie")
})

;

// test("should create new user", async () => {
//   const getUsers = gql`
//     query {
//       Users {
//         name
//         id
//       }
//     }
//   `;
//   const response = await client.query({
//     query: getUsers
//   });
//   expect(response.data.Users[1].name).toBe("Anna");
// });
