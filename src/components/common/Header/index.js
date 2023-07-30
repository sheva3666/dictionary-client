import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

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
  const classes = useStyles();

  const onLogout = async () => {
    const user = getItem("user");
    await updateAuth({
      variables: {
        email: user.userEmail,
        auth: {
          userAuth: false,
          userEmail: user.userEmail,
          language: user.language,
          languageForLearn: user.languageForLearn,
        },
      },
    });
    removeItem("user");
    navigate(ROUTES.home);
  };
  return (
    <div className={classes.header}>
      <BackButton name="< Back" onClick={() => navigate(ROUTES.user)} />
      {score && (
        <h2
          className={classes.score}
        >{`Hello ${score?.userEmail} your current score is ${score?.score}`}</h2>
      )}
      <div className={classes.buttonContainer}>
        <IconButton onClick={() => navigate(ROUTES.settings)} icon={Settings} />
        {getItem("name") && (
          <SecondaryButton onClick={onLogout} name="Logout" betterSize />
        )}
      </div>
    </div>
  );
};

export default Header;
