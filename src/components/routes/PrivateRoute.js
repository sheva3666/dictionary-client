import React from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { gql, useQuery } from "@apollo/client";
import { ROUTES } from "../../constants";
import useLocalStorage from "../../hooks/useLocalStorage";

const GET_AUTH = gql`
  query Auth($userEmail: String!) {
    auth(userEmail: $userEmail) {
      userEmail
      userAuth
      language
      languageForLearn
    }
  }
`;

const PrivateRoute = ({ component: Component }) => {
  const { getItem } = useLocalStorage();

  const { data, loading } = useQuery(GET_AUTH, {
    variables: {
      userEmail: getItem("user").userEmail,
    },
  });

  if (loading) return <LoadingSpinner />;

  return data?.auth ? <Component /> : <Navigate to={ROUTES.login} />;
};

export default PrivateRoute;
