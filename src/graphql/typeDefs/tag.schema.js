const { gql } = require("apollo-server-core");

module.exports = gql`
  type Tag {
    id: ID!
    poster: String
    name: String!
    description: String
    slug: String
    submissionGuideline: String
    about: String!
    createdAt: String
    updatedAt: String
  }

  input TagInput {
    poster: String
    name: String!
    description: String
    submissionGuideline: String
    about: String!
  }

  extend type Query {
    tags: [Tag]
  }

  extend type Mutation {
    createTag(tagInput: TagInput!): Tag!
  }
`;