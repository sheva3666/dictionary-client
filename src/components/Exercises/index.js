import React, { useState, useEffect } from "react";
import Words from "./components/Words";
import Translation from "./components/Translation";
import useStyles from "./styles";
import useExerciseData from "./hooks/useExerciseData";
import LoadingSpinner from "../common/LoadingSpinner";
import Header from "../common/Header";

export const answers = {
  correct: "CORRECT",
  incorrect: "INCORRECT",
};

const Exercises = () => {
  const [correct, setCorrect] = useState(null);
  const { word, translatedWords, loading } = useExerciseData();
  const classes = useStyles();
  console.log(word);

  const onCheck = (chooseWord) => {
    if (chooseWord === word.randomWord.translate) {
      setCorrect(answers.correct);
    } else {
      setCorrect(answers.incorrect);
    }
  };
  console.log(translatedWords);

  return (
    <>
      <Header />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={classes.exercises}>
          <Words word={word} />
          <Translation
            checkWord={word?.randomWord.translate}
            correct={correct}
            onCheck={onCheck}
            words={translatedWords}
          />
        </div>
      )}
    </>
  );
};

export default Exercises;
