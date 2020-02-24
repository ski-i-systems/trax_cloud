require("cross-fetch/polyfill");
const ApolloBoost = require("apollo-boost").default;
const { gql } = require("apollo-boost");
const mongoose = require("mongoose");
const { hashPassword } = require("../src/utils/hashPassword");
const organisationModel = require("../src/api/organisation/organisation.model");
const userModel = require("../src/api/user/user.model");

const Seeder = require('../src/utils/seedDatabaseWithData');

const client = new ApolloBoost({
  uri: "http://localhost:7777"
});

// async function clearDB(done) {
//   // const collections = await mongoose.connection.db.collections();
//   // if (collections) {
//   //   for (var i in collections) {
//   //     collections[i].deleteMany({});
//   //   }
//   }
//   //   for (var i in mongoose.connection.collections) {
//   //     mongoose.connection.collections[i].remove(function() {});
//   //   }
//   return done();
// }

beforeAll(async () => {
  // await Seeder.seedDatabaseWithTestData().then(() => {
  //   return;
  // });

})

beforeEach(async function(done) {

// const orgDetails = {
//     userData: {
//       name: "Paul",
//       adminName: "Paul",
//       adminEmail: "paul@paulltd.ie",
//       adminPassword: "12345678"
//     },
//     userSchema: userModel
//   };
//   const result = await organisationModel.createNewOrganisation(orgDetails);

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
        console.log('in here');
        return done();
        //return clearDB(done);
      }
    );
  } else {
    console.log('or here');
    return done();
    //return clearDB(done);
  }
});

// afterEach(function(done) {
//   mongoose.disconnect();
//   return done();
// });

test("should create organisation with user", async (done) => {
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
  }).then()

  console.log('data is ', response.data);
  
  expect(response.data.createOrganisation.organisation.name).toBe("Paul Ltd");
  expect(response.data.createOrganisation.adminUser.email).toBe(
    "paulmc@paulltd.ie"
  );
  return done();
});

test("should log the user Paulmc in", async (done) => {
  const logPaulIn = gql`
    mutation{
      loginUser(data:{
        email:"paulmc@paulltd.ie"
        password:"12345678"
      }){
        token
        user{
          name
          email
        }
      }
    }
  `
  const response = await client.mutate({
    mutation: logPaulIn
  });

console.log(response.data);

  //expect(response.data.loginUser.token).toBe("Paul Ltd");
  expect(response.data.loginUser.user.email).toBe(
    "paulmc@paulltd.ie"
  );

  return done();
});

afterAll(async done => {
  //await Seeder.clearDatabase();
console.log('db should be cleared...');
  // clearDB(done);
  return done();
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

// test("should  user", async () => {
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
