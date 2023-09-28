import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";

import { BackButton, IconButton, SecondaryButton } from "../Buttons";
import { ROUTES } from "../../../constants";
import Settings from "./images/Settings.png";
import useLocalStorage from "../../../hooks/useLocalStorage";
import useStyles from "./styles";

const LOGOUT = gql`
  mutation UpdateAuth($email: String!, $auth: UserAuthInput!) {
    updateAuth(email: $email, auth: $auth) {
      userEmail
      userAuth
      language
      languageForLearn
    }
  }
`;

const Header = ({ score }) => {
  const [updateAuth] = useMutation(LOGOUT);

  const { getItem, removeItem } = useLocalStorage();
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  const onLogout = async () => {
    removeItem("user");
    removeItem("token");
    navigate(ROUTES.home);
  };

  const isLoginRegisterPath =
    location.pathname === ROUTES.login || location.pathname === ROUTES.register;

  const urlForBackButton = isLoginRegisterPath ? ROUTES.home : ROUTES.user;

  return (
    <div className={classes.header}>
      <BackButton
        hidden={location.pathname === ROUTES.user}
        name="< Back"
        onClick={() => navigate(urlForBackButton)}
      />
      {score && (
        <h2
          className={classes.score}
        >{`Hello! ${score?.userEmail} your current score is ${score?.score}`}</h2>
      )}
      {!isLoginRegisterPath && (
        <div className={classes.buttonContainer}>
          <IconButton
            onClick={() => navigate(ROUTES.settings)}
            icon={Settings}
          />
          {getItem("name") && (
            <SecondaryButton onClick={onLogout} name="Logout" betterSize />
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
