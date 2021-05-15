const auth = require("./auth.resolver");
const user = require("./user.resolver");
const post = require("./post.resolver");
const tag = require("./tag.resolver");
const comment = require("./comment.resolver");

module.exports = {
  Query: {
    ...auth.Query,
    ...user.Query,
    ...post.Query,
    ...tag.Query,
    ...comment.Query,
  },

  Mutation: {
    ...auth.Mutation,
    ...user.Mutation,
    ...post.Mutation,
    ...tag.Mutation,
    ...comment.Mutation,
  },
};
