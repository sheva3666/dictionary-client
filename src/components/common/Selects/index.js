import React from "react";
import classNames from "classnames";
import useStyles from "./styles";

export const Select = ({ label, options, name, onChange, value }) => {
  const classes = useStyles();
  return (
    <>
      <label className={classes.label} htmlFor={name}>
        {label}:
      </label>

      <select
        id={name}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className={classNames(classes.select, {})}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};

export const SettingsSelect = ({ label, options, name, onChange, value }) => {
  const classes = useStyles();
  return (
    <>
      <label className={classes.label} htmlFor={name}>
        {label}:
      </label>

      <select
        id={name}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className={classes.settingsSelect}
        name={name}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
};
