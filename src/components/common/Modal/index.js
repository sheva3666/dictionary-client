import React from "react";
import { PrimaryButton, SecondaryButton } from "../Buttons";
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
          <PrimaryButton
            disabled={disabled}
            onClick={onSubmit}
            betterSize
            name="Add"
          />
          <SecondaryButton
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
