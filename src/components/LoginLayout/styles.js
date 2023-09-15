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
    padding: "50px 70px 50px 60px",
    background: "#fff",
    margin: "0 auto",
    marginTop: 80,
    marginBottom: 80,
    maxWidth: 400,
    borderRadius: 20,
  },
}));
