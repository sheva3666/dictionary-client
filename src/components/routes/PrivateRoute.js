import React from "react";
import { gql, useQuery } from "@apollo/client";

import LoadingSpinner from "../common/LoadingSpinner";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../constants";

export const GET_USER = gql`
  query User($user: String!) {
    user(user: $user) {
      email
      language
      languageForLearn
    }
  }
`;

const PrivateRoute = ({ component: Component }) => {
  const { getItem } = useLocalStorage();

  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      user: getItem("user").email || "",
    },
  });

  if (loading) return <LoadingSpinner />;
  data?.user && localStorage.setItem("user", JSON.stringify(data?.user));

  return !error ? <Component /> : <Navigate to={ROUTES.login} />;
};

export default PrivateRoute;
