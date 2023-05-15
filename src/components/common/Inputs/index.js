import useStyles from "./styles";
import classNames from "classnames";

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

export const PasswordInput = ({
  onChange,
  placeholder,
  label,
  confirmPassword,
}) => {
  const classes = useStyles();

  return (
    <>
      <label htmlFor="">{label}:</label>
      <input
        className={classNames(classes.passwordInput, {
          [classes.error]: confirmPassword,
        })}
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
