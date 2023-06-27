import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { TransperentButton, Button } from "../common/Buttons";
import useStyles from "./styles";

const Home = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Welcome to your dictionary!</h2>
      <div className={classes.buttonsContainer}>
        <TransperentButton
          onClick={() => navigate(ROUTES.user)}
          name="Sign in"
        />
        <Button
          onClick={() => navigate(ROUTES.register)}
          exerciseColor
          name="Register"
        />
      </div>
    </div>
  );
};

export default Home;
