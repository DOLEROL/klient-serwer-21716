const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    me: User!
    toDo: [ToDo!]
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): LoginResponse!
    logout: Boolean!
    addToDo(todo: String!): Boolean!
    updateToDo(todo: String!, option: String): Boolean!
  }

  type User {
    id: ID
    email: String!
  }

  type ToDo {
    todo: String!
    state: String!
  }

  type LoginResponse {
    accessToken: String!
    user: User!
  }
`;

module.exports = typeDefs;
