import React from "react";
import useStyles from "./styles";

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Welcome to your dictionary!</h2>
      <div className={classes.buttonsContainer}></div>
    </div>
  );
};

export default Home;
