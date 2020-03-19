const { server } = require("../../src/server");

const Seeder  = require("../../src/utils/seedDatabaseWithData");

module.exports = async () => {
  let resp = await Seeder.seedDatabaseWithTestData();

   console.log('resp is', resp);

  global.httpServer = await server.start({ port: 7777 });
  // .then(success => {
  //   console.log('we should have seeded it all good, so now start up the test server', success);
  // }).catch(err => {
  //   console.log('Something has gone wrong in seeding the db so expect unusual test results.', err);
  // }).finally(async () => {

    //console.log('We are in the finally block so the seeddata success msg should be displaying first....');

//  });

};
