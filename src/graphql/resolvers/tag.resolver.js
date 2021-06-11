const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const slugify = require("../../utils/slugify");
module.exports = {
  Query: {
    async tags(_, __, { prisma }) {
      try {
        const tags = await prisma.tag.findMany({
          include: {
            _count: true,
          },
        });
        return tags;
      } catch (error) {
        return error;
      }
    },

    async tag(_, { slug, include }, { prisma }) {
      try {
        const tags = await prisma.tag.findUnique({
          where: {
            slug,
          },

          include: {
            posts: include ? include.includes("posts") : false,
            _count: true,
          },
        });
        return tags;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    async createTag(_, { tagInput }, { prisma, userId }) {
      try {
        let { poster, name, description, submissionGuideline, about } =
          tagInput;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user && user.role !== "ADMIN") {
          throw new AuthenticationError("You are not allowed to create tag");
        }

        const existTag = await prisma.tag.findFirst({
          where: {
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
        });

        if (existTag) {
          throw new UserInputError("ALREADY_EXISTS", {
            message: "Tag already exists",
          });
        }

        const slug = slugify(name);
        const tag = await prisma.tag.create({
          data: {
            poster,
            name,
            slug,
            description,
            submissionGuideline,
            about,
          },
        });

        return tag;
      } catch (error) {
        return error;
      }
    },
  },
};
