import React, { useState } from "react";
import Table from "../../../common/Table";
import { compact } from "lodash";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { capitalizeFirstLetter } from "../../../../utils/utils";
import TableToolbar from "../TableToolbar";
import { gql, useQuery } from "@apollo/client";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { Button } from "../../../common/Buttons";

const GET_WORDS = gql`
  query Words(
    $user: String!
    $language: String!
    $translateLanguage: String!
    $searchString: String!
    $page: Int
  ) {
    words(
      user: $user
      language: $language
      translateLanguage: $translateLanguage
      page: $page
      searchString: $searchString
    ) {
      numberOfPages
      currentPage
      words {
        id
        user
        word
        translate
        translateLanguage
        language
      }
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

const DictionaryTable = ({ classes }) => {
  const [searchQueryString, setSearchString] = useState("");
  const [page, setPage] = useState(1);

  const { getItem } = useLocalStorage();
  const { languageForLearn, language, userEmail } = getItem("user");
  const tableHeader = createTableHeader({ language, languageForLearn });
  console.log(searchQueryString);

  const { data, loading } = useQuery(GET_WORDS, {
    variables: {
      user: userEmail,
      language: languageForLearn,
      translateLanguage: language,
      page,
      searchString: searchQueryString || "null",
    },
  });

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      <TableToolbar
        searchValue={searchQueryString}
        onSearch={setSearchString}
        pages={data?.words.numberOfPages}
        currentPage={data?.words.currentPage}
      />
      <Table tableHeader={tableHeader} tableData={data?.words.words} />
      <div className={classes.buttonContainer}>
        <Button
          betterSize
          name="Previouse page"
          onClick={() => setPage(data?.words.currentPage - 1)}
          disabled={data?.words.currentPage === 1}
        />
        <Button
          betterSize
          name="Next page"
          onClick={() => setPage(data?.words.currentPage + 1)}
          disabled={data?.words.currentPage === data?.words.numberOfPages}
        />
      </div>
    </div>
  );
};

export default DictionaryTable;
