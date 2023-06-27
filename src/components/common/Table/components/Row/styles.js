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
    padding: "70px 100px 200px 60px",
    background: "#fff",
    margin: "0 auto",
    marginTop: 100,
    maxWidth: 400,
    borderRadius: 20,
    borderLeft: "1px solid #00316B",
  },
}));
