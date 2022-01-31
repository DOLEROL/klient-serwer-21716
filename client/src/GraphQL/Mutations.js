import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export const ADDTODO = gql`
  mutation ($todo: String!){
    addToDo(todo: $todo)
  }
`;

export const UPDATETODO = gql`
  mutation ($todo: String!, $option: String){
    updateToDo(todo: $todo, option: $option)
  }
`;