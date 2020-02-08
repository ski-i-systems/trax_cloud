const jwt = require("jsonwebtoken");
const getUserId = (request, requireAuth = true) => {
  // get header
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    //strip out Bearer
    const token = header.replace("Bearer ", "");
    //verify or stop
    let decoded = "";
    try {
      decoded = jwt.verify(token, "Thisisthesecret");
    } catch (err) {
      console.log(err);
    }
    console.log("decoded", decoded);

    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error("auth required");
  }
  return null;
};

module.exports = { getUserId };
