import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  table: {
    background: "#fff",
    border: "1px solid #000",
    borderRadius: "0px 0px 10px 10px ",
    display: "block",
  },
  headerCell: {
    margin: 0,
    padding: "10px 15px",
    width: 400,
    fontSize: 30,
  },
  rowCell: {
    padding: "10px 15px",
    textAlign: "center",
  },
  header: {
    borderBottom: "1px solid #000",
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
}));
