import React, { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { Input } from "../Inputs";

const SearchField = ({ onSearch, value }) => {
  const [searchInputValue, setSearchInputValue] = useState(value);

  const debounceSetSearchString = useCallback(
    debounce((searchVal) => onSearch(searchVal || ""), 1000),
    []
  );

  const handleChange = (val) => {
    setSearchInputValue(val);
    debounceSetSearchString(val);
  };

  return (
    <Input
      placeholder={"Search"}
      value={searchInputValue}
      onChange={handleChange}
    />
  );
};

export default SearchField;
