const {server} = require("./server");
// const organisation = require("./api/organisation");
// const file = require("./api/file");
// const lodash = require("lodash");
// const user = require("./api/user");

server.start({ port: 7777 }, () =>
  console.log(`The server is running on port 7777`)
);
