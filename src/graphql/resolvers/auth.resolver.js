const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const {
  generateHash,
  generateUsername,
  matchPassword,
  generateJwtToken,
} = require("../../utils/auth.util");

module.exports = {
  Query: {
    // fetch current user
    async me(_, __, { prisma, userId }) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new AuthenticationError("token is missing");
      }
      return user;
    },
  },
  Mutation: {
    // login user
    async login(_, { email, password }, { prisma }) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new UserInputError("USER_NOT_FOUND", {
            message: "Account with this email does not found create new one",
          });
        }

        const matchPass = await matchPassword(password, user.password);

        if (!matchPass) {
          throw new UserInputError("INCORRECT_PASSWORD", {
            message: "Password is incorrect",
          });
        }

        const token = generateJwtToken(user.id);

        return {
          user,
          token,
        };
      } catch (error) {
        return error;
      }
    },

    // create new account
    async register(_, { name, email, password }, { prisma }) {
      try {
        const checkEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (checkEmail) {
          throw new UserInputError("EMAIL_ALREADY_EXISTS", {
            message: "Account with this email is already exists ",
          });
        }

        username = generateUsername(email);
        password = await generateHash(password);

        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password,
            username,
          },
        });

        const token = generateJwtToken(newUser.id);

        return {
          token,
          user: newUser,
        };
      } catch (error) {
        return error;
      }
    },
  },
};
