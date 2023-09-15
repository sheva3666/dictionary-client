import React from "react";

const Row = ({ rowData, classes }) => (
  <tr>
    <td className={classes.rowCellWord}>{rowData.word}</td>
    <td className={classes.rowCellTranslate}>{rowData.translate}</td>
  </tr>
);

export default Row;
