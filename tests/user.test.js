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

//This client will carry the authorization header and should be created when the test logging in the user is succesful.
let authorizedClient, userOrganisationId;

const getAuthorizedClient = (token) => {
  return new ApolloBoost ({
    uri: "http://localhost:7777",
    request : (operation) => {
      if(token){
        operation.setContext({
          headers: {
            "Authorization" : `Bearer ${token}`
          }
        })
      }
    }
  })
};

//Test Variables....
//We will use the userToken here to create the 
//let userToken, userOrganisationId;

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
  //  return Seeder.clearDatabase().then((clearDBResult) => {
  //   console.log('result of clearing database is ', clearDBResult);
  //   //console.log('So now let\'s try to seed it again with original base data.....');
  //   Seeder.seedDatabaseWithTestData().then(seedResult => {
  //     //console.log('seedResult is : ', seedResult);
  //     //console.log('should have successfully seeded the database and tests can proceed.');
  //     // return;
  //   }).catch(err => {
  //     //console.log('Something has gone wrong, so should we proceed with the tests?', err);
  //     // return;
  //   })
  // }).catch(err => {
  //   //console.log('heres the promise...', theResp);  

  //   // return;
  // });
})

beforeEach(async function(done) {
  return done();
});

afterEach(function(done) {
//  mongoose.disconnect();
  return done();
});


test("should log the admin user Paulmc in", async (done) => {
  const logPaulIn = gql`
    mutation{
      loginUser(data:{
        email:"paulmc@Eisystems.ie"
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
  let userToken = response.data.loginUser.token;

  authorizedClient = getAuthorizedClient(userToken);

  expect(response.data.loginUser.user.email).toBe(
    "paulmc@eisystems.ie"
  );

  return done();
});

test("should get total users in EiSystems, which should be 6", async () => {
  let idVar = `id: "${userOrganisationId}"`;
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
  //const response = await client.query({
  const response = await authorizedClient.query({
    query: getUsersInPaulsOrg
  });
  expect(response.data.usersByOrg.length).toBe(6);
});


let createdFileID;
test("Should Create a Purchase Invoice file in EISystems", async () => {
  const createFile = gql`
mutation{
  createFile(data:{
    documentType:"Purchase Invoice"
  }, fields:[
    {key:"Invoice Number", value:"12345"},
    {key:"PO Number", value:"PO-101"}, 
    {key:"Net Amt", value:"29.99", dataType: currency}
  ]){
  	file{
      id
      documentType
      fields{
        key
        value
        dataType
      }
    }
  }
}
  `;
const response = await authorizedClient.mutate({
  mutation: createFile
});

createdFileID = response.data.createFile.file.id;

expect(response.data.createFile.file.fields.length).toBe(3);
expect(response.data.createFile.file.documentType).toBe("Purchase Invoice");

let poNumberField = response.data.createFile.file.fields.find(x => x.key == "PO Number");
let netamtField = response.data.createFile.file.fields.find(x => x.key == "Net Amt");
let invoicenumField = response.data.createFile.file.fields.find(x => x.key == "Invoice Number");

expect(poNumberField.value).toBe("PO-101");
expect(poNumberField.dataType).toBe("string");
expect(netamtField.value).toBe("29.99");
expect(netamtField.dataType).toBe("currency");
expect(invoicenumField.value).toBe("12345");
expect(invoicenumField.dataType).toBe("string");

});

test("Should update the file just created by Paul, and update it to add a date field and change it's PO number", async () => {
  let idVar = `_id: "${createdFileID}"`;
  const updateFile = gql`
  mutation{
    updateFile(${idVar} , data:{
      documentType:"Purchase Invoice"
    }, fields:[
      {key:"Order Date", value:"18/02/2020", dataType: datetime},
      {key:"PO Number", value:"PO-202"}, 
      {key:"Net Amt", value:"29.99", dataType: currency}
    ]){
      file{
        id
        documentType
        fields{
          key
          value
          dataType
        }
      }
    }
  }
    `;

  const response = await authorizedClient.mutate({
    mutation: updateFile
  });
  expect(response.data.updateFile.file.fields.length).toBe(4);
  expect(response.data.updateFile.file.documentType).toBe("Purchase Invoice");

  let poNumberField = response.data.updateFile.file.fields.find(x => x.key == "PO Number");
  let orderDateField = response.data.updateFile.file.fields.find(x => x.key == "Order Date");
  let netamtField = response.data.updateFile.file.fields.find(x => x.key == "Net Amt");
  let invoicenumField = response.data.updateFile.file.fields.find(x => x.key == "Invoice Number");
  
  expect(poNumberField.value).toBe("PO-202");
  expect(orderDateField.value).toBe("18/02/2020");
  expect(netamtField.value).toBe("29.99");
  expect(invoicenumField.value).toBe("12345");

})

test("Should delete the file just created by Paul", async () => {
  let idVar = `id: "${createdFileID}"`;
  const deleteFile = gql`
  mutation{
    deleteFile(${idVar}){
      deleteCount
      success
    }
  }
    `;
  const response = await authorizedClient.mutate({
    mutation: deleteFile
  });
  expect(response.data.deleteFile.deleteCount).toBe(1);
  expect(response.data.deleteFile.success).toBe("Success");
})



//#region UnUsedTests
//This test is kind of unnecessary, as it's only testing our seed method to fill the dataase,
// test("should get total user count, expecting 26", async () => {
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
//   console.log('users length ', response.data.Users.length);
//   expect(response.data.Users.length).toBe(26);
// });

//#region sum Tests
// test("1 plus 2 should be 3", () => {
// // return Seeder.sum(1, 2)
// let re = Seeder.sum(1,2);
//   expect(re).toBe(3);
// });

// test("1 plus 2 should be 3 even after async", () => {
//   return Seeder.sumAsync(1, 2)
//     .then(re => {
//     expect(re).toBe(3);    
//    })
  
//   // let re = Seeder.sum(1,2);
//   //   expect(re).toBe(3);
// });  

// test("1 plus 1 should be 2", () => {
// // return Seeder.sum(1, 1)
// //     .then(re => {
// //     expect(re).toBe(2);    
// //   })

// let re = Seeder.sum(1,1);
//   expect(re).toBe(2);
// });

// test("1 plus 1 should be 2 even after async", () => {
//   return Seeder.sumAsync(1, 1)
//       .then(re => {
//       expect(re).toBe(2);    
//     })
//   // let re = Seeder.sum(1,1);
//   //   expect(re).toBe(2);
// });
  
// test("2 plus 2 should be 4", () => {
// let re = Seeder.sum(2,2);
// expect(re).toBe(4);
// });

// test("2 plus 2 should be 4 even after async", () => {
//   let resp = Seeder.sumAsync(2, 2);
//   return resp.then(re => {
//     expect(re).toBe(4);      
//   })
// });
    //#endregion





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

//#endregion

afterAll(async done => {
  //await Seeder.clearDatabase();
//console.log('db should be cleared...');
  // clearDB(done);
  return done(); 
});
