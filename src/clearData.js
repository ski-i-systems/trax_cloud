const { clearDatabase } = require("../src/utils/seedDatabaseWithData");

const mongoose = require("mongoose");
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
      console.log("in here");
      //return
      done();
      //return clearDB(done);
    }
  );
}
clearDatabase();
