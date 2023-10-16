import React, { useEffect, useState } from "react";
import Table from "../../../common/Table";
import { compact } from "lodash";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import { capitalizeFirstLetter } from "../../../../utils/utils";
import TableToolbar from "../TableToolbar";
import { gql, useQuery } from "@apollo/client";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { PrimaryButton } from "../../../common/Buttons";
import { ErrorMessage } from "../../../common/Messages";
import { ROUTES } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import WordsForm from "../WordsForm";

export const GET_WORDS = gql`
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
  const navigate = useNavigate();

  const { getItem } = useLocalStorage();
  const { languageForLearn, language, email } = getItem("user");
  const tableHeader = createTableHeader({ language, languageForLearn });

  const { data, loading, error } = useQuery(GET_WORDS, {
    variables: {
      user: email,
      language: languageForLearn,
      translateLanguage: language,
      page,
      searchString: searchQueryString || "null",
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (searchQueryString.length > 0) {
      setPage(1);
    }
  }, [searchQueryString]);

  if (loading) return <LoadingSpinner />;
  return (
    <div>
      {!data?.words?.words?.length && !searchQueryString ? (
        <div className={classes.error}>
          <WordsForm />
          <ErrorMessage
            classes={classes}
            message="You have to add new words to your dictionary."
          />
          <PrimaryButton
            onClick={() => navigate(ROUTES.user)}
            name="To Actions"
          />
        </div>
      ) : (
        <>
          <WordsForm />
          <TableToolbar
            searchValue={searchQueryString}
            onSearch={setSearchString}
            pages={data?.words.numberOfPages}
            currentPage={data?.words.currentPage}
          />
          <Table tableHeader={tableHeader} tableData={data?.words?.words} />
          <div className={classes.buttonContainer}>
            <PrimaryButton
              betterSize
              name="Back"
              onClick={() => setPage(data?.words.currentPage - 1)}
              disabled={data?.words.currentPage === 1}
            />
            <PrimaryButton
              betterSize
              name="Next"
              onClick={() => setPage(data?.words.currentPage + 1)}
              disabled={data?.words.currentPage === data?.words.numberOfPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DictionaryTable;
