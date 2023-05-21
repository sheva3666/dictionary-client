import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  title: {
    color: "#fff",
    fontSize: 64,
  },
  buttonsContainer: {
    display: "flex",
    gap: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
}));
