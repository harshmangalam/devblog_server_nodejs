const { AuthenticationError, UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async comments(_, __, { prisma }) {
      try {
        const comments = await prisma.comment.findMany();
        return comments;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    async createComment(_, { content, image, postId }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError(
            "You have not loggedin to create comments"
          );

        const findPost = await prisma.post.findUnique({
          where: {
            id: Number(postId),
          },
        });

        if (!findPost)
          throw new UserInputError("NOT_FOUND", {
            message: "Post not found",
          });

        const comment = await prisma.comment.create({
          data: {
            content,
            image,
            author: {
              connect: {
                id: userId,
              },
            },
            post: {
              connect: {
                id: Number(postId),
              },
            },
          },
        });

        return comment;
      } catch (error) {
        return error;
      }
    },

    async likeUnlikeComment(_, { commentId }, { prisma, userId }) {
      try {
        const commentExist = await prisma.comment.findUnique({
          where: {
            id: Number(commentId),
          },
        });

        if (!commentExist) {
          throw new UserInputError("NOT_FOUND", {
            message: "Comment not found",
          });
        }

        const checkLike = await prisma.comment.findFirst({
          where: {
            id: Number(commentId),
            likes: {
              some: {
                id: userId,
              },
            },
          },
        });

        let comment;

        if (checkLike) {
          comment = await prisma.comment.update({
            where: {
              id: Number(commentId),
            },
            data: {
              likes: {
                disconnect: [{ id: userId }],
              },
            },
          });
        } else {
          comment = await prisma.comment.update({
            where: {
              id: Number(commentId),
            },
            data: {
              likes: {
                connect: [{ id: userId }],
              },
            },
          });
        }

        return comment;
      } catch (error) {
        return error;
      }
    },
  },
};
