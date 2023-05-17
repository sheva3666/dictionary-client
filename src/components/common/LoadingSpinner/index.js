import React from "react";
import useStyles from "./styles";

const LoadingSpinner = () => {
  const classes = useStyles();
  return <div className={classes.loader}></div>;
};

export default LoadingSpinner;
