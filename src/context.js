const { AuthenticationError } = require("apollo-server-errors");
const prisma = require("./prisma");
const { decodeJwtToken } = require("./utils/auth.util");

module.exports = async ({ req, res }) => {
  const token = req.headers.authorization || "";

  let userId;
  if (token) {
    try {
      userId = decodeJwtToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AuthenticationError(
          "Your session has been expired login again"
        );
      } else if (error.name === "JsonWebTokenError") {
        throw new AuthenticationError(
          "Incorrect authentication token login again"
        );
      }
    }
  }

  return {
    userId,
    prisma,
  };
};
