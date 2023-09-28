import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { SettingsSelect } from "../../common/Selects";
import { LANGUAGES } from "../../LoginLayout/constants";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { GET_USER } from "../../routes/PrivateRoute";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { LongButton } from "../../common/Buttons";

const UPDATE_USER = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      email
      language
      languageForLearn
    }
  }
`;

const Languages = () => {
  const { getItem } = useLocalStorage();
  const navigate = useNavigate();
  const user = getItem("user");
  const [updatedUser, setUpdatedUser] = useState({
    email: user.email,
    language: user.language,
    languageForLearn: user.languageForLearn,
  });
  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [
      {
        query: GET_USER,
        variables: {
          user: getItem("user").email,
        },
      },
    ],
  });

  const handleLanguageSelectChange = (value) => {
    setUpdatedUser({ ...updatedUser, language: value });
  };

  const handleLanguageForLearnSelectChange = (value) => {
    setUpdatedUser({ ...updatedUser, languageForLearn: value });
  };

  const onSaveLanguage = async (user, password, newPassword) => {
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
      <LongButton
        settngsWidth
        onClick={(e) => onSaveLanguage(e)}
        name="Save changes"
      />
    </>
  );
};

export default Languages;
