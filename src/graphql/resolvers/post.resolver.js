const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const slugify = require("../../utils/slugify");

module.exports = {
  Query: {
    async posts(_, { include, orderBy, sinceDay, pagination }, { prisma }) {
      try {
        let posts = await prisma.post.findMany({
          // where:{
          //   createdAt: {
          //     lte: new Date(),
          //     gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * sinceDay),
          //   },
          // },
          orderBy: orderBy ? { [orderBy]: "desc" } : undefined,
          include: {
            tags: include ? include.includes("tags") : false,
            subscribes: include ? include.includes("subscribes") : false,
            author: include ? include.includes("author") : false,
            hearts: include ? include.includes("hearts") : false,
            unicorns: include ? include.includes("unicorns") : false,
            bookmarks: include ? include.includes("bookmarks") : false,
            comments: include ? include.includes("comments") : false,
            _count: true,
          },

          skip: pagination?.skip || 0,
          take: pagination?.take || 1,
        });

        const postCounts = await prisma.post.count();
        const paginationData = {
          total: postCounts,
        };

        return {
          posts,
          pagination: paginationData,
        };
      } catch (error) {
        return error;
      }
    },

    async post(_, { postId, include = {} }, { prisma }) {
      try {
        const post = await prisma.post.findUnique({
          where: {
            id: Number(postId),
          },

          include: Object.keys(include).length ? include : undefined,
        });

        if (!post)
          throw new UserInputError("NOT_FOUND", {
            message: "Post not found",
          });

        return post;
      } catch (error) {
        return error;
      }
    },
  },

  Mutation: {
    async createPost(_, { postInput }, { prisma, userId }) {
      try {
        let { title, content, poster, tags } = postInput;
        if (!userId) {
          throw new AuthenticationError(
            "You should login first to create post"
          );
        }
        const maxWordPerMin = 275;

        const slug = slugify(title);
        const readTime = Math.ceil(postInput.content.length / maxWordPerMin);

        const post = await prisma.post.create({
          data: {
            title,
            content,
            slug,
            poster,
            tags: tags?.length
              ? {
                  connect: [
                    ...tags.slice(0, 4).map((tag) => ({ id: Number(tag) })),
                  ],
                }
              : undefined,
            readTime,
            author: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return post;
      } catch (error) {
        return error;
      }
    },

    async updatePost(_, { postId, postInput }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError(
            "You should login first to update post"
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

        if (findPost.authorId !== userId) {
          throw new AuthenticationError(
            "You have not privilege to modify this post"
          );
        }

        if (postInput.tags) {
          postInput.tags = {
            connect: postInput.tags
              .slice(0, 4)
              .map((tag) => ({ id: Number(tag) })),
          };
        }

        const updatedPost = await prisma.post.update({
          where: {
            id: Number(postId),
          },
          data: postInput,
        });

        return updatedPost;
      } catch (error) {
        return error;
      }
    },

    async deletePost(_, { postId }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError(
            "You should login first to delete post"
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

        if (findPost.authorId !== userId) {
          throw new AuthenticationError(
            "You have not privilege to remove this post"
          );
        }

        await prisma.post.delete({
          where: {
            id: Number(postId),
          },
        });

        return true;
      } catch (error) {
        return error;
      }
    },

    async togglePostReaction(_, { postId, reactionType }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError(
            "You should login first to delete post"
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

        const hasReaction = await prisma.post.findFirst({
          where: {
            id: Number(postId),
            [reactionType]: {
              some: {
                id: userId,
              },
            },
          },
        });

        let updatePostReaction;

        if (hasReaction) {
          updatePostReaction = await prisma.post.update({
            where: {
              id: Number(postId),
            },
            data: {
              [reactionType]: {
                disconnect: [{ id: userId }],
              },
            },
          });
        } else {
          updatePostReaction = await prisma.post.update({
            where: {
              id: Number(postId),
            },
            data: {
              [reactionType]: {
                connect: [{ id: userId }],
              },
            },
          });
        }

        return updatePostReaction;
      } catch (error) {
        return error;
      }
    },
  },
};
