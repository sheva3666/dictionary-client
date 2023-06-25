import useStyles from "./styles";
import classNames from "classnames";

export const TransperentButton = ({
  name,
  onClick,
  betterSize,
  exerciseWidth,
  disabled,
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
  width,
  correct,
  incorrect,
}) => {
  const classes = useStyles();
  return (
    <button
      onClick={onClick}
      className={classNames(classes.button, {
        [classes.betterSize]: betterSize,
        [classes.width]: width,
        [classes.red]: incorrect,
        [classes.green]: correct,
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
