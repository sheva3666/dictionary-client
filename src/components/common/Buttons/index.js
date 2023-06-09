import useStyles from "./styles";
import classNames from "classnames";

export const TransperentButton = ({
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
      className={classNames(classes.transperentButton, {
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

export const Button = ({
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
      className={classNames(classes.button, {
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

export const BackButton = ({ name, onClick, disabled }) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classes.backButton}
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
