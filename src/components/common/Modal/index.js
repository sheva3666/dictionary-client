import React from "react";
import { Button, TransperentButton } from "../Buttons";
import { CheckBox } from "../Inputs";
import Title from "../Title";
import useStyles from "./styles";

const Modal = ({
  checkBoxValue,
  children,
  title,
  onCancel,
  onSubmit,
  onCheckBoxClick,
  disabled,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.modal}>
      <div className={classes.content}>
        <Title title={title} />
        {children}
        <div className={classes.footer}>
          <CheckBox
            value={checkBoxValue}
            onChange={onCheckBoxClick}
            label="Add another"
          />
          <Button
            disabled={disabled}
            onClick={onSubmit}
            betterSize
            name="Add"
          />
          <TransperentButton
            onClick={onCancel}
            betterSize
            exerciseColor
            name="Cancel"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
