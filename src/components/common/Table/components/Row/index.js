import React from "react";

const Row = ({ rowData, classes }) => (
  <tr>
    <td className={classes.rowCell}>{rowData.word}</td>
    <td className={classes.rowCell}>{rowData.translate}</td>
  </tr>
);

export default Row;
