import React, { useState } from "react";
import { EmailInput, PasswordInput, Input } from "../../common/Inputs";
import { LongButton } from "../../common/Buttons";
import Select from "../../common/Select";
import useStyles from "./styles";
import { LANGUAGES } from "../constants";

const Register = () => {
  const classes = useStyles();
  const [registerUser, setRegisterUser] = useState({
    name: "",
    email: "",
    password: "",
    language: "",
    languageForLearn: "",
  });
  console.log(registerUser);
  const [checkPassword, setCheckPassword] = useState("");

  const handleCheckPasswordInputChange = (value) => {
    setCheckPassword(value);
  };
  const handleNameInputChange = (value) => {
    setRegisterUser({ ...registerUser, name: value });
  };

  const handleEmailInputChange = (value) => {
    setRegisterUser({ ...registerUser, email: value });
  };

  const handlePasswordInputChange = (value) => {
    setRegisterUser({ ...registerUser, password: value });
  };

  const handleLanguageSelectChange = (value) => {
    setRegisterUser({ ...registerUser, language: value });
  };

  const handleLanguageForLearnSelectChange = (value) => {
    setRegisterUser({ ...registerUser, languageForLearn: value });
  };

  const onRegister = () => {};
  return (
    <form className={classes.form}>
      <h2 className={classes.title}>Create new account!</h2>
      <Input
        value={registerUser.name}
        onChange={handleNameInputChange}
        placeholder="Enter your name"
        label="Name"
      />
      <Select
        value={registerUser.language}
        name="Chose your language"
        onChange={handleLanguageSelectChange}
        label="Your language"
        options={LANGUAGES}
      />
      <Select
        value={registerUser.languageForLearn}
        name="Chose language for Learn"
        onChange={handleLanguageForLearnSelectChange}
        label="Language for learn"
        options={LANGUAGES}
      />
      <EmailInput
        value={registerUser.email}
        onChange={handleEmailInputChange}
        placeholder="Enter your email"
      />
      <PasswordInput
        value={registerUser.password}
        onChange={handlePasswordInputChange}
        placeholder="Enter your password"
        label="Password"
      />
      <PasswordInput
        value={checkPassword}
        onChange={handleCheckPasswordInputChange}
        placeholder="Enter your password"
        label="Confirm password"
      />
      <LongButton onClick={onRegister} name="Sign in" />
    </form>
  );
};

export default Register;
