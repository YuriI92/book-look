const  { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // if there is token in req headers, return user data, or else throw err
            if (context.user) {
                // get user by its id
                const userData = await User.findOne({ _id: context.user._id });
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            // get user by its email
            const user = await User.findOne({ email });

            // if the user not found, throw error
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // use User model's method to verify password
            const correctPsw = await user.isCorrectPassword(password);

            // if the password is incorrect, throw err
            if (!correctPsw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // create token
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            // add user
            const user = await User.create(args);
            // create token
            const token = signToken(user);
            
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                // get user by its id and update savedBooks array to include selected book
                const userData = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args } },
                    { new: true, runValidators: true }
                );

                return userData;
            }

            // throw error if the context doesn't have user info
            throw new AuthenticationError('Not logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // get user by its id to update savedBooks to remove the selected book from its array
                const userData = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return userData;
            }

            throw new AuthenticationError('Not logged in!');
        }
    }
}

module.exports = resolvers;
