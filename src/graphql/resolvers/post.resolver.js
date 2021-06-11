const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const slugify = require("../../utils/slugify");
const shortid = require("shortid");
module.exports = {
  Query: {
    async posts(_, { include, orderBy, pagination, filter }, { prisma }) {
      try {
        let posts = await prisma.post.findMany({
          where: filter
            ? {
                ...filter,
              }
            : undefined,
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

          skip: pagination?.skip || undefined,
          take: pagination?.take || undefined,
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

    async post(_, { slug, include }, { prisma }) {
      try {
        const post = await prisma.post.findUnique({
          where: {
            slug,
          },

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
        let { title, content, poster, tags, posterPublicId } = postInput;
        console.log(poster, posterPublicId);

        if (!userId) {
          throw new AuthenticationError(
            "You should login first to create post"
          );
        }
        const maxWordPerMin = 275;

        const slug = slugify(title) + "-" + shortid.generate();
        const readTime = Math.ceil(postInput.content.length / maxWordPerMin);

        const post = await prisma.post.create({
          data: {
            title,
            content,
            slug,
            poster,
            posterPublicId,
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

            include: {
              _count: true,
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
            include: {
              _count: true,
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
