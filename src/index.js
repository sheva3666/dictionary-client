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
import { ROUTES } from "./constants";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const errorLink = onError(({ response, graphQLErrors, networkError }) => {
  console.log(graphQLErrors);
  if (graphQLErrors[0].extensions.code === "UNAUTHENTICATED") {
    window.location.href = `http://localhost:3000${ROUTES.login}`;
  }
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
  const token = JSON.parse(localStorage.getItem("token"));
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
