const { gql } = require("apollo-server-express");

module.exports = gql`

  type PaginationData {
    total:Int
    
  }
  input PaginationInput {
    take: Int
    skip: Int
  }
  enum Sort {
    asc
    desc
  }
  type Query

  type Mutation
`;
