import React, { useState } from "react";
import { EmailInput, PasswordInput } from "../../common/Inputs";
import { LongButton } from "../../common/Buttons";
import useStyles from "./styles";

const Login = () => {
  const classes = useStyles();
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const handleEmailInputChange = (value) => {
    setLoginUser({ ...loginUser, email: value });
  };

  const handlePasswordInputChange = (value) => {
    setLoginUser({ ...loginUser, password: value });
  };

  const onLogin = () => {};
  return (
    <form className={classes.form}>
      <h2 className={classes.title}>Welcome back!</h2>
      <EmailInput
        onChange={handleEmailInputChange}
        placeholder="Enter your email"
      />
      <PasswordInput
        label="Password"
        onChange={handlePasswordInputChange}
        placeholder="Enter your password"
      />
      <LongButton onClick={onLogin} name="Sign in" />
    </form>
  );
};

export default Login;
