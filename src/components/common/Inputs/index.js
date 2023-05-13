import useStyles from "./styles";

export const EmailInput = ({ onChange, placeholder }) => {
  const classes = useStyles();
  return (
    <>
      <label htmlFor="">Email:</label>
      <input
        className={classes.emailInput}
        type="email"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export const PasswordInput = ({ onChange, placeholder, label }) => {
  const classes = useStyles();

  return (
    <>
      <label htmlFor="">{label}:</label>
      <input
        className={classes.passwordInput}
        type="password"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export const Input = ({ onChange, placeholder, label }) => {
  const classes = useStyles();

  return (
    <>
      <label htmlFor="">{label}:</label>
      <input
        className={classes.passwordInput}
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};
