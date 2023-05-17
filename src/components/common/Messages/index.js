import useStyles from "./styles";

export const ErrorMessage = ({ message }) => {
  const classes = useStyles();
  return <div className={classes.message}>{message}</div>;
};

export const SuccessMessage = ({ message, classes }) => {
  return <div className={classes.message}>{message}</div>;
};
