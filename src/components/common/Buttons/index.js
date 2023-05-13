import useStyles from "./styles";

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

export const LongButton = ({ name, onClick }) => {
  const classes = useStyles();
  return (
    <button onClick={onClick} className={classes.longButton}>
      {name}
    </button>
  );
};
