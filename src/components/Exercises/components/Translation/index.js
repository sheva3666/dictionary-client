import classNames from "classnames";
import React, { useMemo } from "react";
import { answers } from "../..";
import { SecondaryButton } from "../../../common/Buttons";
import useStyles from "./styles";

const Translation = ({ checkWord, words, onCheck, correct }) => {
  const classes = useStyles();

  const random = useMemo(
    () => words?.sort(() => Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkWord, words?.length]
  );

  return (
    <div className={classNames(classes.container)}>
      {random?.map(({ word }) => {
        return (
          <SecondaryButton
            exerciseColor
            correct={checkWord === word && correct === answers.correct}
            incorrect={checkWord !== word && correct === answers.incorrect}
            key={`${word}${Math.random()}`}
            name={word}
            onClick={() => onCheck(word)}
          />
        );
      })}
    </div>
  );
};

export default Translation;
