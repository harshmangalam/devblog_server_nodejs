const { gql } = require("apollo-server-express");

const baseTypes = require("./base.schema");
const authTypes = require("./auth.schema");
const userTypes = require("./user.schema");
const postTypes = require("./post.schema");
const tagTypes = require("./tag.schema");
const commentTypes = require("./comment.schema");

module.exports = [
  baseTypes,
  authTypes,
  userTypes,
  postTypes,
  tagTypes,
  commentTypes,
];
