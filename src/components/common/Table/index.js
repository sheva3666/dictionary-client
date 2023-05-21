import React from "react";
import Header from "./components/Header";
import Row from "./components/Row";
import useStyles from "./styles";

const Table = ({ tableHeader, tableData }) => {
  console.log(tableHeader);
  const classes = useStyles();
  return (
    <table className={classes.table}>
      <Header classes={classes} tableHeader={tableHeader} />
      {tableData.map((rowData) => (
        <Row classes={classes} rowData={rowData} />
      ))}
    </table>
  );
};

export default Table;
