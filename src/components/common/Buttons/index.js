import useStyles from "./styles";
import classNames from "classnames";

export const TransperentButton = ({ name, onClick, betterSize }) => {
  const classes = useStyles();
  return (
    <button
      onClick={onClick}
      className={classNames(classes.transperentButton, {
        [classes.betterSize]: betterSize,
      })}
    >
      {name}
    </button>
  );
};

export const Button = ({ name, onClick, betterSize }) => {
  const classes = useStyles();
  return (
    <button
      onClick={onClick}
      className={classNames(classes.button, {
        [classes.betterSize]: betterSize,
      })}
    >
      {name}
    </button>
  );
};

export const LongButton = ({ name, onClick, disabled }) => {
  const classes = useStyles();
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(classes.longButton, {
        [classes.disabled]: disabled,
      })}
    >
      {name}
    </button>
  );
};
