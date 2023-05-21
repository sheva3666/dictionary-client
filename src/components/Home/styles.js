import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  title: {
    color: "#fff",
    fontSize: 64,
    textAlign: "center",
  },
  buttonsContainer: {
    display: "flex",
    gap: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
    marginTop: 200,
    maxWidth: 800,
  },
}));
