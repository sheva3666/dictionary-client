import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  buttonsContainer: {
    display: "flex",
    gap: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 30,
    padding: "50px 70px 50px 60px",
    background: "#fff",
    margin: "0 auto",
    marginTop: 80,
    maxWidth: 400,
    borderRadius: 20,
  },
}));
