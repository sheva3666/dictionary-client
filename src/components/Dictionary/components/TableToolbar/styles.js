import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "10px 20px",
    borderRadius: "10px 10px 0px 0px ",
  },
  title: {
    margin: 0,
  },
}));
