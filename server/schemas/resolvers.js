const  { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async (parent, { username }) => {
            const userData = await User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks');
            
            return userData;
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
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

            return user;
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);

            return user;
        },
    }
}

module.exports = resolvers;
