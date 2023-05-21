import React from "react";
import { Button, TransperentButton } from "../Buttons";
import { CheckBox } from "../Inputs";
import useStyles from "./styles";

const Modal = ({
  checkBoxValue,
  children,
  title,
  onCancel,
  onSubmit,
  onCheckBoxClick,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.modal}>
      <h2 className={classes.title}>{title}</h2>
      {children}
      <div className={classes.footer}>
        <CheckBox
          value={checkBoxValue}
          onChange={onCheckBoxClick}
          label="Add another"
        />
        <Button onClick={onSubmit} betterSize name="Add" />
        <TransperentButton onClick={onCancel} betterSize name="Cancel" />
      </div>
    </div>
  );
};

export default Modal;
