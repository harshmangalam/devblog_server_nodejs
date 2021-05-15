const prisma = require("./prisma");
const { decodeJwtToken } = require("./utils/auth.util");

module.exports = async ({ req, res }) => {
  const token = req.headers.authorization || "";

  let userId;
  if (token) {
    userId = decodeJwtToken(token);
  }

  return {
    userId,
    prisma,
  };
};
