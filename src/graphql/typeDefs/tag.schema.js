const { gql } = require("apollo-server-core");

module.exports = gql`
  type Tag {
    id: ID!
    poster: String
    name: String!
    description: String
    posts:[Post]
    slug: String
    submissionGuideline: String
    about: String!
    createdAt: String
    updatedAt: String
    _count: TagRelationCount
  }

  type TagRelationCount {
    posts: Int
  }

  enum TagIncludeInput {
    posts
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
    tag(slug: String!,include: [TagIncludeInput]): Tag!
  }

  extend type Mutation {
    createTag(tagInput: TagInput!): Tag!
  }
`;
