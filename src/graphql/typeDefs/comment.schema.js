const { gql } = require("apollo-server-core");

module.exports = gql`
  type Comment {
    id: ID
    content: String
    image: String
    author: User
    authorId: ID
    createdAt: String
    updatedAt: String
    post: Post
    postId: ID
  }

  extend type Query {
    comments: [Comment]!
  }
  extend type Mutation {
    createComment(content: String, image: String, postId: ID!): Comment!

    likeUnlikeComment(commentId: ID!): Comment!
  }
`;
