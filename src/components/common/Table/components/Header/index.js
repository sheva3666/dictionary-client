import React from "react";

const Header = ({ tableHeader, classes }) => (
  <tr className={classes.header}>
    {tableHeader.map(({ name, id }) => (
      <th className={classes.headerCell} key={id}>
        {name}
      </th>
    ))}
  </tr>
);

export default Header;
