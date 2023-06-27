import React from "react";
import DictionaryTable from "./components/DictionaryTable";
import useStyles from "./styles";
import Header from "../common/Header";

const Dictionary = () => {
  const classes = useStyles();
  return (
    <div className={classes.dictionary}>
      <Header />
      <div className={classes.container}>
        <DictionaryTable classes={classes} />
      </div>
    </div>
  );
};

export default Dictionary;
