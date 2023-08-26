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
  betterSize,
  disabled,
  width,
  correct,
  incorrect,
}) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.primaryButton, {
        [classes.betterSize]: betterSize,
        [classes.width]: width,
        [classes.red]: incorrect,
        [classes.green]: correct,
        [classes.disabled]: disabled,
      })}
    >
      {name}
    </button>
  );
};

export const LongButton = ({ name, onClick, disabled, marginTop }) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.longButton, {
        [classes.disabled]: disabled,
        [classes.marginTop]: marginTop,
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
