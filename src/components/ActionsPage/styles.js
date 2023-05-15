import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 40px",
    background: "#fff",
    borderRadius: 30,
    border: "2px solid #00316B",
    boxShadow: "-2rem 2rem 2rem rgba(white, 0.2)",
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.794)",
    },
  },
  text: {
    width: 130,
    textAlign: "center",
    marginTop: 20,
  },
  icon: {
    width: "30%",
    height: "100%",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    margin: "auto",
    marginTop: 250,
    maxWidth: 800,
  },
}));
