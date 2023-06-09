import React from "react";
import Title from "../../common/Title";
import { EmailInput, PasswordInput } from "../../common/Inputs";
import { ErrorMessage } from "../../common/Messages";
import { LongButton } from "../../common/Buttons";
import useStyles from "./styles";
import useLoginHandle from "../hooks/useLoginHandle";
import LoadingSpinner from "../../common/LoadingSpinner";

const Login = () => {
  const {
    handleEmailInputChange,
    handlePasswordInputChange,
    user,
    loading,
    onLogin,
    errorMessage,
  } = useLoginHandle();
  const classes = useStyles();
  if (loading) return <LoadingSpinner />;
  return (
    <form className={classes.form}>
      <Title title="Welcome back!" />
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <EmailInput
        value={user.email}
        onChange={handleEmailInputChange}
        placeholder="Enter your email"
      />
      <PasswordInput
        value={user.password}
        label="Password"
        onChange={handlePasswordInputChange}
        placeholder="Enter your password"
      />
      <LongButton marginTop onClick={(e) => onLogin(e)} name="Login" />
    </form>
  );
};

export default Login;
