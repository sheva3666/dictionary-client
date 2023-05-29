import React, { useState } from "react";
import Table from "../../../common/Table";
import { compact } from "lodash";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { capitalizeFirstLetter } from "../../../../utils/utils";
import TableToolbar from "../TableToolbar";
import { gql, useQuery } from "@apollo/client";
import LoadingSpinner from "../../../common/LoadingSpinner";

const GET_WORDS = gql`
  query Words(
    $user: String!
    $language: String!
    $translateLanguage: String!
    $searchString: String!
  ) {
    words(
      user: $user
      language: $language
      translateLanguage: $translateLanguage
      searchString: $searchString
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
  const [searchQueryString, setSearchString] = useState("");

  const { getItem } = useLocalStorage();
  const { languageForLearn, language, userEmail } = getItem("user");
  const tableHeader = createTableHeader({ language, languageForLearn });
  console.log(searchQueryString);

  const { data, loading } = useQuery(GET_WORDS, {
    variables: {
      user: userEmail,
      language: languageForLearn,
      translateLanguage: language,
      searchString: searchQueryString || "null",
    },
  });

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <TableToolbar
        searchValue={searchQueryString}
        onSearch={setSearchString}
        tableLength={data?.words.length}
      />
      <Table tableHeader={tableHeader} tableData={data?.words} />
    </div>
  );
};

export default DictionaryTable;
