const { gql } = require('apollo-server-express');

exports.typeDefs = gql`

type Post {
    _id: ID!
    author: ID!
    publicationDate: String!
    text: String!
    picture: String!
}

type Query {
    getAllPosts: [Post],
    getPost (id: String): Post
}

`;
