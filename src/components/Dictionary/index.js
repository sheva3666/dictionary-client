import React from "react";
import DictionaryTable from "./components/DictionaryTable";
import useStyles from "./styles";
import Header from "../common/Header";

const Dictionary = () => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <div className={classes.container}>
        <DictionaryTable classes={classes} />
      </div>
    </>
  );
};

export default Dictionary;
