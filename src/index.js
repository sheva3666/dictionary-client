import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  from,
} from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const errorLink = onError(({ response, graphQLErrors }) => {
  if (graphQLErrors) {
    try {
      JSON.parse(graphQLErrors);
    } catch (e) {
      // If not replace parsing error message with real one
      // eslint-disable-next-line no-param-reassign
      response.errors[0].message = graphQLErrors[0].extensions.response.body;
    }
  }
});

const appLink = from([errorLink, httpLink]);

const authLink = setContext((_, { headers }) => {
  const token = process.env.REACT_APP_AUTH_TOKEN_KEY;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(appLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
);
