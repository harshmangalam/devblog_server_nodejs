const { gql } = require("apollo-server-express");

module.exports = gql`
  type AuthResponse {
    token: String!
    user: User!
  }

  extend type Query {
    me: User!
  }

  extend type Mutation {
    login(email: String!, password: String): AuthResponse!
    register(name: String!, email: String!, password: String!): AuthResponse!
  }
`;
