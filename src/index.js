const { server } = require("./server");
const { generateGetUrl, generatePutUrl } = require("./awsPresigner");
// const organisation = require("./api/organisation");
// const file = require("./api/file");
// const lodash = require("lodash");
// const user = require("./api/user");

let devVars = {};

devVars.path = __dirname + "\\config\\dev.env.js";

require("dotenv").config(devVars);

server.start({ port: 7777 }, () => {
  console.log(`The server is running on port 7777`);
});

// const results = generateGetUrl("test2.png")
//   .then((getURL) => {
//     console.log(getURL);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
