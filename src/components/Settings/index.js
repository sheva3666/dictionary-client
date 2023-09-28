import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import Header from "../common/Header";
import { SettingsSelect } from "../common/Selects";
import { LANGUAGES } from "../LoginLayout/constants";
import useLocalStorage from "../../hooks/useLocalStorage";
import { PasswordInput } from "../common/Inputs";
import { LongButton } from "../common/Buttons";
import Title from "../common/Title";
import { ErrorMessage } from "../common/Messages";

import { GET_USER } from "../routes/PrivateRoute";

import useStyles from "./styles";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

const UPDATE_USER = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      email
      language
      languageForLearn
    }
  }
`;

const Settings = () => {
  const { getItem } = useLocalStorage();
  const user = getItem("user");
  const navigate = useNavigate();
  const [updatedUser, setUpdatedUser] = useState({
    email: user.email,
    language: user.language,
    languageForLearn: user.languageForLearn,
  });

  const [updateUser, { error }] = useMutation(UPDATE_USER, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: {
          user: getItem("user").email,
        },
      },
    ],
  });

  const classes = useStyles();

  const handleLanguageSelectChange = (value) => {
    setUpdatedUser({ ...updatedUser, language: value });
  };

  const handleLanguageForLearnSelectChange = (value) => {
    setUpdatedUser({ ...updatedUser, languageForLearn: value });
  };

  const handlePasswordInputChange = (value) => {
    setUpdatedUser({ ...updatedUser, password: value });
  };

  const onSaveChanges = async () => {
    try {
      await updateUser({
        variables: { user: updatedUser },
      })
        .then(setUpdatedUser({ ...updatedUser, password: "" }))
        .then(() => navigate(ROUTES.user));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className={classes.container}>
        <Title title="Settings" />
        <SettingsSelect
          value={updatedUser.language}
          name="Chose your language"
          onChange={handleLanguageSelectChange}
          label="What language do you use?"
          options={LANGUAGES}
          fixedWidth
        />
        <SettingsSelect
          value={updatedUser.languageForLearn}
          name="Chose your language"
          onChange={handleLanguageForLearnSelectChange}
          label="What language do you learn?"
          options={LANGUAGES}
          fixedWidth
        />

        {error && <ErrorMessage message={error.message} />}

        <PasswordInput
          value={updatedUser.password}
          label="Password"
          onChange={handlePasswordInputChange}
          placeholder="Enter your password for confirm"
          settings
        />

        <LongButton
          settngsWidth
          onClick={(e) => onSaveChanges(e)}
          name="Save changes"
        />
      </div>
      ;
    </>
  );
};

export default Settings;
