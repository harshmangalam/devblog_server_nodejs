const {
  UserInputError,
  AuthenticationError,
  ValidationError,
} = require("apollo-server-errors");
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
      try {
        if (!userId) {

          const error = new Error();
          error.code = "USERID_MISSING";
          error.message = "userid missing";
          throw error;
        }
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          throw new UserInputError("USER_NOT_FOUND", {
            message: "User not found",
          });
        }

        return user
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    // login user
    async login(_, { email, password }, { prisma }) {
      try {
        let error = {};

        if (!email || email.trim.length) {
          error = { ...error, email: "Email must not be empty" };
        }
        if (!password) {
          error = { ...error, password: "Password must not be empty" };
        }

        if (Object.keys(error).length) {
          console.log(error);
          throw new UserInputError("EMPTY_FIELDS", error);
        }
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

        return { token, user };
      } catch (error) {
        return error;
      }
    },

    // create new account
    async register(_, { name, email, password }, { prisma }) {
      try {
        let error = {};

        if (!email || email.trim.length) {
          error = { ...error, email: "Email must not be empty" };
        }
        if (!password) {
          error = { ...error, password: "Password must not be empty" };
        }

        if (!name) {
          error = { ...error, name: "Name must not be empty" };
        }

        if (Object.keys(error).length) {
          console.log(error);
          throw new UserInputError("EMPTY_FIELDS", error);
        }

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
