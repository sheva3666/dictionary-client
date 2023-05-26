import React, { useState } from "react";
import Header from "../common/Header";
import useStyles from "./styles";
import { SettingsSelect } from "../common/Selects";
import { LANGUAGES } from "../LoginLayout/constants";
import useLocalStorage from "../../hooks/useLocalStorage";
import { PasswordInput } from "../common/Inputs";
import { LongButton } from "../common/Buttons";

const Settings = () => {
  const { getItem } = useLocalStorage();
  const user = getItem("user");
  const [updatedUser, setUpdatedUser] = useState({
    email: user.userEmail,
    password: "",
    language: user.language,
    languageForLearn: user.languageForLearn,
  });

  const handleLanguageSelectChange = (value) => {
    setUpdatedUser({ ...updatedUser, language: value });
  };

  const handleLanguageForLearnSelectChange = (value) => {
    setUpdatedUser({ ...updatedUser, languageForLearn: value });
  };

  const handlePasswordInputChange = (value) => {
    setUpdatedUser({ ...updatedUser, password: value });
  };
  const classes = useStyles();
  return (
    <>
      <Header />
      <div className={classes.container}>
        <h2 className={classes.title}>Settings</h2>
        <SettingsSelect
          value={updatedUser.language}
          name="Chose your language"
          onChange={handleLanguageSelectChange}
          label="Your language"
          options={LANGUAGES}
          fixedWidth
        />
        <SettingsSelect
          value={updatedUser.languageForLearn}
          name="Chose your language"
          onChange={handleLanguageForLearnSelectChange}
          label="Your language"
          options={LANGUAGES}
          fixedWidth
        />

        <PasswordInput
          value={updatedUser.password}
          label="Password"
          onChange={handlePasswordInputChange}
          placeholder="Enter your password for confirm"
          settings
        />

        <LongButton onClick={(e) => {}} name="Save changes" />
      </div>
      ;
    </>
  );
};

export default Settings;
