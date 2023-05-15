import React from "react";
import useStyles from "./styles";

const Modal = ({ children, title }) => {
  const classes = useStyles();
  return (
    <div className={classes.modal}>
      <h2 className={classes.title}>{title}</h2>
      {children}
    </div>
  );
};

export default Modal;
