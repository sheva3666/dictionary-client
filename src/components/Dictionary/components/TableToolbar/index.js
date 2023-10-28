import React from "react";
import SearchField from "../../../common/SearchField";

import useStyles from "./styles";

const TableToolbar = ({ pages, currentPage, onSearch, searchValue }) => {
  const classes = useStyles();
  return (
    <div className={classes.toolBar}>
      <div className={classes.pagesInfo}>
        <h2 className={classes.title}>All pages({pages})</h2>
        <h2 className={classes.title}>Current page({currentPage})</h2>
      </div>
      <SearchField customColor onSearch={onSearch} value={searchValue} />
    </div>
  );
};

export default TableToolbar;
