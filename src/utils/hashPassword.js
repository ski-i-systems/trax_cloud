const bcrypt = require("bcryptjs");

const hashPassword = password => {
  if (password.length < 8) {
    throw new Error("must be atleast 8 chars long");
  }

  return bcrypt.hash(password, 10);
};

module.exports = { hashPassword };
