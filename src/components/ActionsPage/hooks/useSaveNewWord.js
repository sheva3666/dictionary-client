import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { GET_WORDS } from "../../Dictionary/components/DictionaryTable";

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
  const { email, language, languageForLearn } = JSON.parse(
    localStorage.getItem("user")
  );
  const [addWord, { loading, error }] = useMutation(ADD_WORD, {
    refetchQueries: ["Words"],
  });
  const [word, setWord] = useState({
    word: "",
    translate: "",
  });

  const inputIsValid = (inputString) => {
    const pattern = /^\p{L}+$/u;
    if (inputString) {
      return pattern.test(inputString);
    }
    return true;
  };

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

  const savingDisabled =
    !word.word ||
    !word.translate ||
    !inputIsValid(word.word) ||
    !inputIsValid(word.translate);

  const onSaveWord = async () => {
    const newWord = {
      user: email,
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
    inputIsValid,
  };
};

export default useSaveNewWord;
