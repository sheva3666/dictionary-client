import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  table: {
    background: "#fff",
    color: "#00316B",
    borderLeft: "2px solid #00316B",
    borderRight: "2px solid #00316B",
    borderBottom: "2px solid #00316B",
    borderRadius: "0px 0px 10px 10px ",
    display: "block",
  },
  headerCell: {
    margin: 0,
    padding: "10px 15px",
    width: 400,
    fontSize: 30,
    border: "2px solid #00316B",
  },
  rowCellTranslate: {
    padding: "10px 15px",
    textAlign: "center",
    borderLeft: "2px solid #00316B",
  },
  rowCellWord: {
    padding: "10px 15px",
    textAlign: "center",
    borderRight: "2px solid",
  },
  error: {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    gap: 20,
    fontWeight: 400,
    fontSize: 32,
    margin: "0 auto",
  },
  "@media only screen and (max-width: 900px)": {
    headerCell: {
      width: 100,
      fontSize: 30,
    },
  },
}));
