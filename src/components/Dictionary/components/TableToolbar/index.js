import React from "react";
import SearchField from "../../../common/SearchField";
import useStyles from "./styles";

const TableToolbar = ({ tableLength, onSearch, searchValue }) => {
  const classes = useStyles();
  return (
    <div className={classes.toolBar}>
      <h2 className={classes.title}>All({tableLength})</h2>
      <SearchField onSearch={onSearch} value={searchValue} />
    </div>
  );
};

export default TableToolbar;
