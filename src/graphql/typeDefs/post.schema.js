const { gql } = require("apollo-server-core");
module.exports = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    poster: String
    readTime: Int!
    slug: String!
    published: Boolean!
    publishedAt: String

    authorId: Int!
    createdAt: String!
    updatedAt: String!

    author: User
    tags: [Tag]

    hearts: [User]
    unicorns: [User]
    bookmarks: [User]

    _count: PostRelationCount
  }

  type PostRelationCount {
    tags: Int
    subscribes: Int
    hearts: Int
    unicorns: Int
    bookmarks: Int
    comments: Int
  }

  type PostsResponse {
    posts: [Post]!

    pagination: PaginationData # pagination data take and skip
  }

  input PostInput {
    title: String!
    content: String!
    poster: String
    tags: [ID]
  }

  input UpdatePostInput {
    title: String
    content: String
    poster: String
    tags: [ID]
    published: Boolean
    publishedAt: String
  }

  enum PostIncludeInput {
    author
    tags
    hearts
    unicorns
    bookmarks
  }

  enum PostReactionTypeInput {
    hearts
    unicorns
    bookmarks
  }

  enum PostOrderByField {
    publishedAt
    createdAt
    updatedAt
  }

  input PostAuthorFilterRule {
    username: String
  }

  input PostFilterInput {
    author: PostAuthorFilterRule
  }

  extend type Query {
    posts(
      include: [PostIncludeInput] # include relation table associated with post like author,comments etc
      orderBy: PostOrderByField # order posts by field in assending or descending order
      sinceDay: Int # calculate post published between today and provided sinceDay
      pagination: PaginationInput # provide take and skip for pagination
      filter: PostFilterInput
    ): PostsResponse!
    post(slug: String!, include: [PostIncludeInput]): Post!
  }

  extend type Mutation {
    createPost(postInput: PostInput): Post!
    updatePost(postId: ID!, postInput: UpdatePostInput!): Post!
    deletePost(postId: ID!): Boolean!
    togglePostReaction(postId: ID!, reactionType: PostReactionTypeInput): Post!
  }
`;
