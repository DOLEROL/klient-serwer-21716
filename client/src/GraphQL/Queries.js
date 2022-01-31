import { gql } from "@apollo/client";

export const ME = gql`
  query {
    me {
      id
      email
    }
  }
`;

export const TODO = gql`
  query {
    toDo {
      todo
      state
    }
  }
`;
