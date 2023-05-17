import React, { useState } from "react";
import { EmailInput, PasswordInput } from "../../common/Inputs";
import { LongButton, Button } from "../../common/Buttons";
import Select from "../../common/Select";
import { useNavigate } from "react-router-dom";
import useStyles from "./styles";
import useRegisterHandle from "../hooks/useRegisterHandle";
import { ErrorMessage, SuccessMessage } from "../../common/Messages";
import { LANGUAGES } from "../constants";
import { ROUTES } from "../../../constants";

const Register = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const {
    successMessage,
    errorMessage,
    loading,
    checkPassword,
    registerUser,
    confirmPassword,
    disabled,
    handleCheckPasswordInputChange,
    handleEmailInputChange,
    handlePasswordInputChange,
    handleLanguageSelectChange,
    handleLanguageForLearnSelectChange,
    onRegister,
  } = useRegisterHandle();

  console.log(errorMessage);

  if (loading) return <h2>LOADING</h2>;
  return (
    <>
      {successMessage ? (
        <div className={classes.success}>
          <SuccessMessage classes={classes} message={successMessage} />
          <Button onClick={() => navigate(ROUTES.login)} name="Sign in" />
        </div>
      ) : (
        <form className={classes.form}>
          <h2 className={classes.title}>Create new account!</h2>
          {errorMessage && <ErrorMessage message={errorMessage} />}
          <EmailInput
            value={registerUser.email}
            onChange={handleEmailInputChange}
            placeholder="Enter your email"
          />
          <PasswordInput
            confirmPassword={confirmPassword}
            value={registerUser.password}
            onChange={handlePasswordInputChange}
            placeholder="Enter your password"
            label="Password"
          />
          <PasswordInput
            confirmPassword={confirmPassword}
            value={checkPassword}
            onChange={handleCheckPasswordInputChange}
            placeholder="Enter your password"
            label="Confirm password"
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
          <LongButton
            onClick={(e) => onRegister(e)}
            disabled={disabled}
            name={loading ? "Loading..." : "Sign in"}
          />
        </form>
      )}
    </>
  );
};

export default Register;
