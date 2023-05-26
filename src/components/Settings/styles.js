import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  title: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
    margin: 0,
  },
  buttonsContainer: {
    display: "flex",
    gap: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 30,
    padding: "70px 100px 200px 60px",
    background: "#fff",
    margin: "0 auto",
    marginTop: 100,
    maxWidth: 400,
    borderRadius: 20,
  },
}));
