import React from "react";
import useStyles from "./styles";

const TableToolbar = ({ tableLength }) => {
  const classes = useStyles();
  return (
    <div className={classes.toolBar}>
      <h2 className={classes.title}>All({tableLength})</h2>
    </div>
  );
};

export default TableToolbar;
