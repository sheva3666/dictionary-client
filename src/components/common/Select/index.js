import React from "react";
import useStyles from "./styles";

const Select = ({ label, options, name, onChange, value }) => {
  const classes = useStyles();
  return (
    <>
      <label htmlFor={name}>{label}:</label>

      <select
        id={name}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className={classes.select}
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

export default Select;
