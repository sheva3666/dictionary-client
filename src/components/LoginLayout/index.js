import React from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import Login from "./Login";
import Register from "./Register";
import useStyles from "./styles";

const LoginLayout = () => {
  const location = useLocation();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {location.pathname === ROUTES.login && <Login />}
      {location.pathname === ROUTES.register && <Register />}
    </div>
  );
};

export default LoginLayout;
