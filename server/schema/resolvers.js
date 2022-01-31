const bcrypt = require("bcrypt");

const User = require("../models/User");
const ToDo = require("../models/ToDo");
const { createRefreshToken, createAccessToken } = require("../auth");
const isAuth = require("../isAuth");

const root = {
  Query: {
    me: async (_, args, context) => {
      const { id } = isAuth(context);
      const user = await User.findById(id);
      return user;
    },
    toDo: async (_, args, context) => {
      const { id } = isAuth(context);
      return await ToDo.find({ userID: id });
    },
  },

  Mutation: {
    register: async (_, { email, password }) => {
      if (email) {
        email = email.trim().toLowerCase();
      }
      try {
        await User.create({
          email,
          password,
        });
        return true;
      } catch (error) {
        console.log(error);
        throw new Error("Error while creating the account");
      }
    },
    login: async (_, { email, password }, { res }) => {
      if (email) {
        email = email.trim().toLowerCase();
      }
      const user = await User.findOne({ email });
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          res.cookie("jid", createRefreshToken(user), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
          return {
            accessToken: createAccessToken(user),
            user: {
              id: user._id,
              email: user.email,
            },
          };
        }
        throw new Error("Failure during authentication");
      }
      throw new Error("Failure during authentication");
    },
    logout: (parent, args, { res }) => {
      res.cookie("jid", "", {
        httpOnly: true,
      });
      res.clear;
      return true;
    },
    addToDo: async (_, { todo }, context) => {
      const { id } = isAuth(context);
      await ToDo.create({
        userID: id,
        todo,
        state: "todo",
      });
      return true;
    },
    updateToDo: async (_, { todo, option }, context) => {
      const { id } = isAuth(context);
      if (option === "DEL") {
        await ToDo.deleteOne({
          userID: id,
          todo,
        });
      } else if (option === "RES") {
        await ToDo.updateOne(
          {
            userID: id,
            todo,
          },
          {
            $set: {
              state: "todo",
            },
          }
        );
      } else {
        await ToDo.updateOne(
          {
            userID: id,
            todo,
          },
          {
            $set: {
              state: "done",
            },
          }
        );
      }
      return true;
    },
  },
};

module.exports = root;
