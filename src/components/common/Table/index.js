import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import { PrimaryButton } from "../Buttons";
import { ErrorMessage } from "../Messages";
import Header from "./components/Header";
import Row from "./components/Row";
import useStyles from "./styles";

const Table = ({ tableHeader, tableData }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  console.log(tableData?.length);
  return (
    <table className={classes.table}>
      <Header classes={classes} tableHeader={tableHeader} />
      {!tableData?.length ? (
        <div className={classes.error}>
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
        tableData?.map((rowData) => (
          <Row key={rowData.word} classes={classes} rowData={rowData} />
        ))
      )}
    </table>
  );
};

export default Table;
