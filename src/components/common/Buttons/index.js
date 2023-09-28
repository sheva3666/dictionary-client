import useStyles from "./styles";
import classNames from "classnames";

export const SecondaryButton = ({
  name,
  onClick,
  betterSize,
  exerciseWidth,
  disabled,
  exerciseColor,
  correct,
  incorrect,
}) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.secondaryButton, {
        [classes.betterSize]: betterSize,
        [classes.disabled]: disabled,
        [classes.exerciseWidth]: exerciseWidth,
        [classes.exerciseColor]: exerciseColor,
        [classes.red]: incorrect,
        [classes.green]: correct,
      })}
    >
      {name}
    </button>
  );
};

export const PrimaryButton = ({
  name,
  onClick,
  exerciseStyle,
  disabled,
  width,
  correct,
  incorrect,
  betterSize,
}) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.primaryButton, {
        [classes.exerciseStyle]: exerciseStyle,
        [classes.width]: width,
        [classes.red]: incorrect,
        [classes.green]: correct,
        [classes.disabled]: disabled,
        [classes.betterSize]: betterSize,
      })}
    >
      {name}
    </button>
  );
};

export const LongButton = ({
  name,
  onClick,
  disabled,
  marginTop,
  settngsWidth,
}) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.longButton, {
        [classes.disabled]: disabled,
        [classes.marginTop]: marginTop,
        [classes.settngsWidth]: settngsWidth,
      })}
    >
      {name}
    </button>
  );
};

export const BackButton = ({ name, onClick, disabled, hidden }) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.backButton, {
        [classes.hidden]: hidden,
      })}
    >
      {name}
    </button>
  );
};

export const IconButton = ({ onClick, disabled, icon }) => {
  const classes = useStyles();
  return (
    <button
      className={classes.iconButton}
      disabled={disabled}
      onClick={onClick}
    >
      <img src={icon} alt="" />
    </button>
  );
};

export const DoubleButton = ({
  firstName,
  secondName,
  onClick,
  selectedButton,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.doubleButtonContainer}>
      <button
        onClick={onClick}
        disabled={selectedButton === firstName}
        className={classNames(classes.primaryButton, classes.betterSize, {
          [classes.disabled]: selectedButton === firstName,
        })}
      >
        {firstName}
      </button>
      <button
        disabled={selectedButton === secondName}
        onClick={onClick}
        className={classNames(classes.primaryButton, classes.betterSize, {
          [classes.disabled]: selectedButton === secondName,
        })}
      >
        {secondName}
      </button>
    </div>
  );
};
