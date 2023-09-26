import React from "react";
import Header from "./components/Header";
import Row from "./components/Row";
import useStyles from "./styles";

const Table = ({ tableHeader, tableData }) => {
  const classes = useStyles();
  return (
    <table className={classes.table}>
      <Header classes={classes} tableHeader={tableHeader} />
      {tableData?.map((rowData) => (
        <Row key={rowData.word} classes={classes} rowData={rowData} />
      ))}
    </table>
  );
};

export default Table;
