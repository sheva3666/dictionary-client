import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    marginLeft: 40,
  },
  word: {
    fontWeight: "bold",
    fontSize: 64,
  },
}));
