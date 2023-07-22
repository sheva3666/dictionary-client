import React, { useState, useEffect } from "react";
import Words from "./components/Words";
import Translation from "./components/Translation";
import useStyles from "./styles";
import useExerciseData from "./hooks/useExerciseData";
import useScoreData from "./hooks/useScoreData";
import LoadingSpinner from "../common/LoadingSpinner";
import Header from "../common/Header";
import { Button } from "../common/Buttons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";
import { ErrorMessage } from "../common/Messages";

export const answers = {
  correct: "CORRECT",
  incorrect: "INCORRECT",
};

const Exercises = () => {
  const [correct, setCorrect] = useState(null);
  const { word, translatedWords, loading, error } = useExerciseData();
  const { score, updateScore, loading: loadingScore } = useScoreData();

  const classes = useStyles();
  const navigate = useNavigate();

  const onCheck = (chooseWord) => {
    if (chooseWord === word?.randomWord?.translate) {
      setCorrect(answers.correct);
    } else {
      setCorrect(answers.incorrect);
    }
  };

  const onClickNext = async () => {
    const newScore = correct === answers.correct ? 1 : 0;
    await updateScore(newScore).then(window.location.reload());
  };

  useEffect(() => {
    if (error) {
      navigate(ROUTES.user);
    }
  }, []);

  return (
    <>
      <Header score={score?.score} />
      {loading ? (
        <div className={classes.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : !word?.randomWord ? (
        <div className={classes.error}>
          <ErrorMessage
            classes={classes}
            message="You have to add new words to your dictionary."
          />
          <Button onClick={() => navigate(ROUTES.user)} name="To Actions" />
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.exercises}>
            <Words word={word} />
            <Translation
              checkWord={word?.randomWord?.translate}
              correct={correct}
              onCheck={onCheck}
              words={translatedWords}
            />
            <Button
              disabled={!correct}
              betterSize
              onClick={onClickNext}
              exerciseWidth
              name="Next word"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Exercises;
