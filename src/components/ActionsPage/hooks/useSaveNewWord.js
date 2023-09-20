import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const ADD_WORD = gql`
  mutation Mutation($word: WordInput!) {
    addWord(word: $word) {
      id
      user
      word
      translate
      translateLanguage
      language
    }
  }
`;

const useSaveNewWord = ({ setIsModalOpen, addAnother }) => {
  const [addWord, { loading, error }] = useMutation(ADD_WORD);
  const [word, setWord] = useState({
    word: "",
    translate: "",
  });

  const { userEmail, language, languageForLearn } = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLearningInputChange = (value) => {
    setWord({ ...word, word: value });
  };

  const handleTranslateInputChange = (value) => {
    setWord({ ...word, translate: value });
  };

  const onClose = () => {
    setWord({
      word: "",
      translate: "",
    });
    if (!addAnother || word.word === "") {
      setIsModalOpen(false);
    }
  };

  const savingDisabled = !word.translate || !word.word;

  const onSaveWord = async () => {
    const newWord = {
      user: userEmail,
      word: word.word,
      language: languageForLearn,
      translate: word.translate,
      translateLanguage: language,
    };
    try {
      await addWord({
        variables: {
          word: newWord,
        },
      });
    } catch (error) {
      console.log(error);
    }
    setWord({
      word: "",
      translate: "",
    });
    if (!error?.message) {
      onClose();
    }
  };

  return {
    word,
    errorMessage: error?.message,
    loading,
    onClose,
    onSaveWord,
    handleLearningInputChange,
    handleTranslateInputChange,
    savingDisabled,
  };
};

export default useSaveNewWord;
