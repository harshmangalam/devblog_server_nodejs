const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    email: String
    name: String
    username: String
    avatar: String
    role: String
    location: [Float]
    createdAt: String
    updatedAt: String
    _count:UserRelationCount
  }

  type UserRelationCount {
    posts:Int
  }

  input UpdateProfileInput {
    name: String
    avatar: String
    bio: String
    displayEmailOnProfile: Boolean
    location: [Float]
  }

  extend type Query {
    users: [User]!
    user(username: String!): User!
  }

  extend type Mutation {
    updateProfile(userInput: UpdateProfileInput): User!
    updateEmail(email: String!): User!
    updateUserName(username: String!): User!
    updatePassword(oldPassword: String, newPassword: String): User!
    deleteAccount(userId: ID!): Boolean!
  }
`;
