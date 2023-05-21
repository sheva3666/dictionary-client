import React from "react";
import Table from "../../../common/Table";
import { compact } from "lodash";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { capitalizeFirstLetter } from "../../../../utils/utils";
import { gql, useQuery } from "@apollo/client";
import LoadingSpinner from "../../../common/LoadingSpinner";

const GET_WORDS = gql`
  query Words($user: String!, $language: String!, $translateLanguage: String!) {
    words(
      user: $user
      language: $language
      translateLanguage: $translateLanguage
    ) {
      word
      translate
      translateLanguage
      language
      id
    }
  }
`;

const createTableHeader = ({ language, languageForLearn }) =>
  compact([
    {
      name: capitalizeFirstLetter(languageForLearn),
      id: languageForLearn,
      cellRenderer: ({ name }) => <p>{name}</p>,
    },
    {
      name: capitalizeFirstLetter(language),
      id: language,
      cellRenderer: ({ owner }) => owner && <p>{owner}</p>,
    },
  ]);

const DictionaryTable = () => {
  const { getItem } = useLocalStorage();
  const { languageForLearn, language, userEmail } = getItem("user");
  const tableHeader = createTableHeader({ language, languageForLearn });

  const { data, loading } = useQuery(GET_WORDS, {
    variables: {
      user: userEmail,
      language: languageForLearn,
      translateLanguage: language,
    },
  });

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <Table tableHeader={tableHeader} tableData={data?.words} />
    </div>
  );
};

export default DictionaryTable;
