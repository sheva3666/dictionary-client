import React from "react";
import useStyles from "./styles";

const Title = ({ title }) => {
  const classes = useStyles();
  return <h2 className={classes.title}>{title}</h2>;
};

export default Title;
