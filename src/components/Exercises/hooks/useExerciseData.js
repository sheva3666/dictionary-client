import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import useLocalStorage from "../../../hooks/useLocalStorage";

const GET_RANDOM_WORD = gql`
  query RandomWord(
    $user: String!
    $language: String!
    $translateLanguage: String!
  ) {
    randomWord(
      user: $user
      language: $language
      translateLanguage: $translateLanguage
    ) {
      id
      user
      word
      translate
      translateLanguage
      language
    }
  }
`;

const GET_RANDOM_TRANSLATED_WORDS = gql`
  query TranslatedWords($language: String!) {
    translatedWords(language: $language) {
      id
      user
      word
      language
    }
  }
`;

const useGetTranslatedWord = ({ user }) => {
  const { data, loading, error } = useQuery(GET_RANDOM_TRANSLATED_WORDS, {
    variables: { language: user.language },
  });
  return {
    translatedWords: data?.translatedWords,
    translatedWordsLoading: loading,
  };
};

const useGetWord = ({ user }) => {
  const { data, loading, error } = useQuery(GET_RANDOM_WORD, {
    variables: {
      user: user.userEmail,
      language: user.languageForLearn,
      translateLanguage: user.language,
    },
  });
  return { word: data, wordLoading: loading };
};

const useExerciseData = () => {
  const { getItem } = useLocalStorage();
  const user = getItem("user");
  const { translatedWords = [], translatedWordsLoading } = useGetTranslatedWord(
    {
      user,
    }
  );
  const { word, wordLoading } = useGetWord({ user });

  return {
    translatedWords:
      translatedWordsLoading || wordLoading
        ? undefined
        : [...translatedWords, { word: word?.randomWord.translate }],
    word: translatedWordsLoading || wordLoading ? undefined : word,
    loading: translatedWordsLoading || wordLoading,
  };
};

export default useExerciseData;
