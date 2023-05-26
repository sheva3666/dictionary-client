import React from "react";
import { answers } from "../..";
import { Button } from "../../../common/Buttons";
import useStyles from "./styles";

const Translation = ({ checkWord, words, onCheck, correct }) => {
  const classes = useStyles();
  console.log(checkWord);
  return (
    <div className={classes.container}>
      {words.map(({ word }) => {
        return (
          <Button
            correct={checkWord === word && correct === answers.correct}
            incorrect={checkWord !== word && correct === answers.incorrect}
            key={word}
            width
            name={word}
            onClick={() => onCheck(word)}
          />
        );
      })}
    </div>
  );
};

export default Translation;
