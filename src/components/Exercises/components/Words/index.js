import React from "react";
import useStyles from "./styles";

const Words = ({ word }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h2 className={classes.word}>{word.randomWord.word}</h2>
    </div>
  );
};

export default Words;
