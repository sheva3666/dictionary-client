import React, { useState } from "react";
import { Input } from "../../../common/Inputs";
import Modal from "../../../common/Modal";
import { capitalizeFirstLetter } from "../../../../utils/utils";
import useStyles from "./styles";
import useSaveNewWord from "../../hooks/useSaveNewWord";
import { ErrorMessage } from "../../../common/Messages";

const WordsModal = ({ setIsModalOpen }) => {
  const [addAnother, setAddAnother] = useState(false);
  const { language, languageForLearn } = JSON.parse(
    localStorage.getItem("user")
  );

  const handleCheckBox = () => {
    if (addAnother) {
      setAddAnother(false);
    } else {
      setAddAnother(true);
    }
  };

  const classes = useStyles();

  const {
    handleTranslateInputChange,
    handleLearningInputChange,
    word,
    onSaveWord,
    errorMessage,
    onClose,
    savingDisabled,
  } = useSaveNewWord({ setIsModalOpen, addAnother });

  return (
    <Modal
      disabled={savingDisabled}
      onCancel={onClose}
      onSubmit={onSaveWord}
      checkBoxValue={addAnother}
      onCheckBoxClick={handleCheckBox}
      title="Add a new word"
    >
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className={classes.container}>
        <Input
          onChange={handleLearningInputChange}
          value={word.word}
          label={capitalizeFirstLetter(languageForLearn)}
        />
        <Input
          onChange={handleTranslateInputChange}
          value={word.translate}
          label={capitalizeFirstLetter(language)}
        />
      </div>
    </Modal>
  );
};

export default WordsModal;
