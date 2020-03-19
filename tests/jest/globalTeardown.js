const Seeder  = require("../../src/utils/seedDatabaseWithData");


module.exports = async () => {
  Seeder.clearDatabase().then(success => {
    console.log('Job done, all should be gone....', success);
  }).catch(err => {
    console.log('Uh oh, somethings gone wrong...', err)
  })

  await global.httpServer.close();
};
