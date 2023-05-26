import useStyles from "./styles";
import classNames from "classnames";

export const EmailInput = ({ onChange, placeholder, value }) => {
  const classes = useStyles();
  return (
    <>
      <label className={classes.label} htmlFor="">
        Email:
      </label>
      <input
        value={value}
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
  value,
  settings,
}) => {
  const classes = useStyles();

  return (
    <>
      <label className={classes.label} htmlFor="">
        {label}:
      </label>
      <input
        className={classNames(classes.passwordInput, {
          [classes.error]: confirmPassword,
          [classes.settings]: settings,
        })}
        type="password"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export const Input = ({ onChange, placeholder, label, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.inputContainer}>
      <label className={classes.label} htmlFor="">
        {label}:
      </label>
      <input
        className={classes.passwordInput}
        value={value}
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export const CheckBox = ({ onChange, label, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.inputContainer}>
      <input type="checkbox" value={value} onChange={onChange} />
      <label htmlFor="">{label}</label>
    </div>
  );
};
