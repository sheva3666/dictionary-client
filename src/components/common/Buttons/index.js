import useStyles from "./styles";
import classNames from "classnames";

export const TransperentButton = ({ name, onClick }) => {
  const classes = useStyles();
  return (
    <button onClick={onClick} className={classes.transperentButton}>
      {name}
    </button>
  );
};

export const Button = ({ name, onClick }) => {
  const classes = useStyles();
  return (
    <button onClick={onClick} className={classes.button}>
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
