const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const { matchPassword, generateHash } = require("../../utils/auth.util");

module.exports = {
  Query: {
    async users(_, __, { prisma }) {
      const users = await prisma.user.findMany();

      return users;
    },
  },

  Mutation: {
    // update user profile
    async updateProfile(_, { userInput }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError("You should login to update profile");

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ...userInput,
          },
        });

        return user;
      } catch (error) {
        return error;
      }
    },

    // update email
    async updateEmail(_, { email }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError("You should login to update email");

        const checkEmail = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
          },
        });

        if (checkEmail && checkEmail.id !== userId) {
          throw new UserInputError("DUPLICATE_EMAIL", {
            message: "Email already exists",
          });
        }

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            email,
          },
        });

        return user;
      } catch (error) {
        return error;
      }
    },

    // update username
    async updateUserName(_, { username }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError("You should login to update username");

        const checkUsername = await prisma.user.findUnique({
          where: {
            username,
          },
          select: {
            id: true,
            username: true,
          },
        });

        if (checkUsername && checkUsername.id !== userId) {
          throw new UserInputError("DUPLICATE_USERNAME", {
            message: "Username already exists",
          });
        }

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return user;
      } catch (error) {
        return error;
      }
    },

    // update password

    async updatePassword(_, { oldPassword, newPassword }, { prisma, userId }) {
      try {
        if (!userId)
          throw new AuthenticationError("You should login to update password");

        const findUser = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            password: true,
          },
        });

        const checkPass = await matchPassword(oldPassword, findUser.password);

        if (!checkPass) {
          throw new UserInputError("INCORRECT_OLD_PASS", {
            message: "Old password is incorrect",
          });
        }

        newPassword = await generateHash(newPassword);

        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: newPassword,
          },
        });

        return user;
      } catch (error) {
        return error;
      }
    },

    // delete account

    async deleteAccount(_, { userId }, { prisma, userId: currentUserId }) {
      try {
        if (!currentUserId) {
          throw new AuthenticationError(
            "You should login first to delete account"
          );
        }

        if (currentUserId !== Number(userId)) {
          throw new AuthenticationError(
            "You are not allowed to delete account"
          );
        }

        const posts = prisma.post.deleteMany({
          where: {
            authorId: currentUserId,
          },
        });
        const user = prisma.user.delete({
          where: {
            id: Number(userId),
          },
        });

        const transaction = await prisma.$transaction([posts, user]);
        console.log(transaction);

        return true;
      } catch (error) {
        return error;
      }
    },
  },
};
