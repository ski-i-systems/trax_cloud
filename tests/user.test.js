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

//Test Variables....
let userToken, userOrganisationId;

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

beforeAll(() => {

   return Seeder.clearDatabase().then((clearDBResult) => {
    //console.log('result of clearing database is ', clearDBResult);
    //console.log('So now let\'s try to seed it again with original base data.....');
    Seeder.seedDatabaseWithTestData().then(seedResult => {
      //console.log('seedResult is : ', seedResult);
      //console.log('should have successfully seeded the database and tests can proceed.');
      // return;
    }).catch(err => {
      //console.log('Something has gone wrong, so should we proceed with the tests?', err);
      // return;
    })
  }).catch(err => {
    //console.log('heres the promise...', theResp);  

    // return;
  });
  
})

beforeEach(async function(done) {
  return done();
});

afterEach(function(done) {
//  mongoose.disconnect();
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
          organisationID
        }
      }
    }
  `
  const response = await client.mutate({
    mutation: logPaulIn
  });

  userOrganisationId = response.data.loginUser.user.organisationID;
  userToken = response.data.loginUser.token;

  expect(response.data.loginUser.user.email).toBe(
    "paulmc@paulltd.ie"
  );

  return done();
});

test("should get total user count, expecting 26", async () => {
  const getUsers = gql`
    query {
      Users {
        name
        id
      }
    }
  `;
  const response = await client.query({
    query: getUsers
  });
  console.log('users length ', response.data.Users.length);
  expect(response.data.Users.length).toBe(26);
});

test("should get total users in PaulLtd, 2", async () => {

  console.log('userOrganisationId =', userOrganisationId);
  let idVar = `id: "${userOrganisationId}"`;
  console.log(idVar);

  const getUsersInPaulsOrg = gql`
    query{
      usersByOrg(${idVar}) {
    id
    organisationID
    name
    email
    password
  }
}
  `;
  const response = await client.query({
    query: getUsersInPaulsOrg
  });
  console.log('users ... ', response.data.usersByOrg);
  expect(response.data.usersByOrg.length).toBe(1);
});


test("1 plus 2 should be 3", () => {
// return Seeder.sum(1, 2)
//   .then(re => {
//   expect(re).toBe(3);    
//  })

let re = Seeder.sum(1,2);
  expect(re).toBe(3);
});

test("1 plus 2 should be 3 even after async", () => {
  return Seeder.sumAsync(1, 2)
    .then(re => {
    expect(re).toBe(3);    
   })
  
  // let re = Seeder.sum(1,2);
  //   expect(re).toBe(3);
});  

test("1 plus 1 should be 2", () => {
// return Seeder.sum(1, 1)
//     .then(re => {
//     expect(re).toBe(2);    
//   })

let re = Seeder.sum(1,1);
  expect(re).toBe(2);
});

test("1 plus 1 should be 2 even after async", () => {
  return Seeder.sumAsync(1, 1)
      .then(re => {
      expect(re).toBe(2);    
    })
  // let re = Seeder.sum(1,1);
  //   expect(re).toBe(2);
});
  
test("2 plus 2 should be 4", () => {
let re = Seeder.sum(2,2);
expect(re).toBe(4);
});

test("2 plus 2 should be 4 even after async", () => {
  let resp = Seeder.sumAsync(2, 2);
  return resp.then(re => {
    expect(re).toBe(4);      
  })
});
    





// test("should create organisation with user", async (done) => {
//   const createOrg = gql`
//     mutation {
//       createOrganisation(
//         data: {
//           name: "Paul Ltd"
//           adminName: "PaulMc"
//           adminEmail: "Paulmc@paulltd.ie"
//           adminPassword: "12345678"
//         }
//       ) { 
//         organisation {
//           name
//           createdAt
//         }
//         adminUser {
//           name
//           email
//         }
//       }
//     }
//   `;
  
//   const response = await client.mutate({
//     mutation: createOrg
//   }).then()

//   console.log('data is ', response.data);
  
//   expect(response.data.createOrganisation.organisation.name).toBe("Paul Ltd");
//   expect(response.data.createOrganisation.adminUser.email).toBe(
//     "paulmc@paulltd.ie"
//   );
//   return done();
// });

// test("should log the user Paulmc in", async (done) => {
//   const logPaulIn = gql`
//     mutation{
//       loginUser(data:{
//         email:"paulmc@paulltd.ie"
//         password:"12345678"
//       }){
//         token
//         user{
//           name
//           email
//         }
//       }
//     }
//   `
//   const response = await client.mutate({
//     mutation: logPaulIn
//   });

// console.log(response.data);

//   //expect(response.data.loginUser.token).toBe("Paul Ltd");
//   expect(response.data.loginUser.user.email).toBe(
//     "paulmc@paulltd.ie"
//   );

//   return done();
// });

afterAll(async done => {
  //await Seeder.clearDatabase();
//console.log('db should be cleared...');
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


