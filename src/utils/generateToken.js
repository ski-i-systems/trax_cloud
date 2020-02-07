const jwt = require("jsonwebtoken");
const generateToken = userId => {
  return jwt.sign({ userId: userId }, "Thisisthesecret", {
    expiresIn: "7 days"
  });
};

module.exports = {
  generateToken
}
