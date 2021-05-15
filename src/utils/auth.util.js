const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.generateUsername = (email) => {
  const max = 9990;
  const min = 1000;

  return (
    email.split("@")[0] + Math.floor(Math.random() * (max - min))
  );
};

exports.generateHash = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

exports.matchPassword = async (password, hashPassword) => {
  const hasMatch = await bcrypt.compare(password, hashPassword);
  return hasMatch;
};

exports.generateJwtToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10h" });
};


exports.decodeJwtToken = (token) => {
  const {userId}  = jwt.verify(token,process.env.JWT_SECRET)
  return userId
}