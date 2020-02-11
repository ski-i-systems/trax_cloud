const bcrypt = require("bcryptjs");

const hashPassword = password => {
  if (password.length < 8) {
    return Promise.reject("Must be at least 8 chars long");
//    throw new Error("must be atleast 8 chars long");
  }

  return bcrypt.hash(password, 10);
};

module.exports = { hashPassword };
