require("cross-fetch/polyfill");
const ApolloBoost = require("apollo-boost").default;
const { gql } = require("apollo-boost");
const mongoose = require("mongoose");
const { hashPassword } = require("../src/utils/hashPassword");
const organisationModel = require("../src/api/organisation/organisation.model");
const userModel = require("../src/api/user/user.model");

const client = new ApolloBoost({
  uri: "http://localhost:7777"
});

async function clearDB() {
  const collections = await mongoose.connection.db.collections();
  console.log(collections);
  for (var i in collections) {
      console.log('collections', collections[i]);
      
    collections[i].deleteMany({});
  }
  // for (var i in mongoose.connection.collections) {
  //   mongoose.connection.collections[i].remove(function() {});
  // }
  // return done();
}

beforeEach(async function(done) {
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
        console.log("got here");
        return clearDB();
      }
    );
  } else {
    console.log("got here else");
    return clearDB();
  }
});

afterEach(function(done) {
  mongoose.disconnect();
  return done();
});

afterAll(done => {
  clearDB();
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
  expect(response.data.createOrganisation.adminUser.email).toBe(
    "paulmc@paulltd.ie"
  );
});

// test("should login with Admin User Created", async () => {
//   const loginUser = gql`
//     loginUser(data:{email:"paulmc@paulltd.ie",password:"12345678"}){
//     user{
//       name
//     }
//     token
//   }
//     `;
//   const response = await client.mutate({
//     mutation: loginUser
//   });
//   expect(response.data.loginUser.user.name).toBe("PaulMc");
// });

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
