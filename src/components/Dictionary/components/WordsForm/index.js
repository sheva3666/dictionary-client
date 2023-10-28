import React from "react";
import { Input } from "../../../common/Inputs";
import { capitalizeFirstLetter } from "../../../../utils/utils";
import { ErrorMessage } from "../../../common/Messages";
import useSaveNewWord from "../../../ActionsPage/hooks/useSaveNewWord";
import useStyles from "./styles";
import { PrimaryButton } from "../../../common/Buttons";

const WordsForm = () => {
  const { language, languageForLearn } = JSON.parse(
    localStorage.getItem("user")
  );

  const classes = useStyles();

  const {
    handleTranslateInputChange,
    handleLearningInputChange,
    word,
    onSaveWord,
    errorMessage,
    savingDisabled,
    inputIsValid,
  } = useSaveNewWord({ setIsModalOpen: () => {} });

  return (
    <div className={classes.container}>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {(!inputIsValid(word.word) || !inputIsValid(word.translate)) && (
        <ErrorMessage message="Words should include only letters." />
      )}
      <div className={classes.formContainer}>
        <Input
          invalidInput={!inputIsValid(word.word)}
          onChange={handleLearningInputChange}
          value={word.word}
          label={capitalizeFirstLetter(languageForLearn)}
        />
        <Input
          invalidInput={!inputIsValid(word.translate)}
          onChange={handleTranslateInputChange}
          value={word.translate}
          label={capitalizeFirstLetter(language)}
        />
        <PrimaryButton
          disabled={savingDisabled}
          betterSize
          onClick={onSaveWord}
          name="Save"
        />
      </div>
    </div>
  );
};

export default WordsForm;
