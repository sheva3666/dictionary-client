import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import useLocalStorage from "../../hooks/useLocalStorage";
import Header from "../common/Header";
import Login from "./Login";
import Register from "./Register";
import useStyles from "./styles";

const LoginLayout = () => {
  const { getItem } = useLocalStorage();
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    if (getItem("user").userAuth === true) {
      navigate(ROUTES.user);
    }
  }, []);

  return (
    <>
      <Header />
      <div className={classes.container}>
        {location.pathname === ROUTES.login && <Login />}
        {location.pathname === ROUTES.register && <Register />}
      </div>
    </>
  );
};

export default LoginLayout;
