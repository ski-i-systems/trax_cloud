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

beforeAll(() => { 
return;

})

beforeEach(async function(done) {
  return done();

});

afterEach(function(done) {

  return done();
});


let deletableorganisationId;
test("Should create a second organisation, Joe Ltd which we will be deleting...", async (done) => {
    const createDeletableOrganisation = gql`
      mutation{
      createOrganisation(data:{
          adminName:"Joe Bloggs"
          adminEmail: "joe@joe.ie",
          adminPassword:"12345678",
          name:"Joe Ltd."
      }){
      organisation{
        id
        name
      }
      adminUser{
        name
        organisationID
        email
      }
    }
  }
    `
    const response = await client.mutate({
      mutation: createDeletableOrganisation
    });
  
    expect(response.data.createOrganisation.adminUser.email).toBe("joe@joe.ie");
    expect(response.data.createOrganisation.adminUser.name).toBe("Joe Bloggs");
    expect(response.data.createOrganisation.organisation.name).toBe("Joe Ltd.");
    deletableorganisationId = response.data.createOrganisation.organisation.id;
  
    return done();
  });

  test("Should delete the Joe organisation, and should be clearing out the joe user...", async (done) => {
    let idVar = `id: "${deletableorganisationId}"`

    console.log('idvar is ', idVar);
    const deleteOrganisation = gql`
      mutation{
      deleteOrganisation(${idVar}){
      deletedCount
    }
  }
    `
    const response = await client.mutate({
      mutation: deleteOrganisation
    });
  
    expect(response.data.deleteOrganisation.deletedCount).toBe(1);
    return done();
  });



afterAll(async done => {
  return done(); 
});
