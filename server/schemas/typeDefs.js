const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Auth {
        token: String
        user: [User]
    }

    type Query {
        me(username: String!): User
    }

    type Mutation {
        login(email: String!, password: String!): User
        addUser(username: String!, email: String!, password: String!): User
        saveBook(bookId: ID!, author: String, description: String!, title: String!, image: String, link: String): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;
