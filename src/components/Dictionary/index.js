import React from "react";
import DictionaryTable from "./components/DictionaryTable";
import useStyles from "./styles";

const Dictionary = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <DictionaryTable />
    </div>
  );
};

export default Dictionary;
