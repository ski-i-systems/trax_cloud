const {server} = require("./server");

// const organisation = require("./api/organisation");
// const file = require("./api/file");
// const lodash = require("lodash");
// const user = require("./api/user");

let devVars = { };

devVars.path = __dirname + '\\config\\dev.env.js';

require('dotenv').config(devVars);


server.start({ port: 7777 }, () => {
  console.log(`The server is running on port 7777`);
  }
);
