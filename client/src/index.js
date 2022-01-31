import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getAccessToken, setAccessToken } from "./accessToken";
import jwtDecode from "jwt-decode";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./App";

// apollo client setup

const refreshToken = new ApolloLink(async (operation, forward) => {
  const token = getAccessToken();
  if (!token) {
    return forward(operation);
  }
  const { exp } = jwtDecode(token);
  if (Date.now() > exp * 1000) {
    const data = await fetch(
      `${process.env.REACT_APP_SERVER_URI}/refresh_token`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const { accessToken } = await data.json();
    setAccessToken(accessToken);
    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        authorization: accessToken,
      },
    }));
  }

  return forward(operation);
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => ({
    headers: {
      ...headers,
      authorization: getAccessToken(),
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_SERVER_URI}/graphql`,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => console.log(message));
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([refreshToken, errorLink, concat(authMiddleware, httpLink)]),
});

// console.log(cache)
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
