import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "10px 20px",
    borderRadius: "10px 10px 0px 0px ",
    border: "1px solid #00316B",
  },
  pagesInfo: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    margin: 0,
    width: 130,
  },
}));
