import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 80px",
    background: "#fff",
    borderRadius: 30,
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.794)",
      boxShadow: "#fff 0px 10px 36px 0px, #fff 0px 0px 0px 1px",
    },
  },
  text: {
    width: 130,
    textAlign: "center",
    marginTop: 20,
  },
  icon: {
    width: "50%",
    height: "100%",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    margin: "auto",
    marginTop: 250,
    maxWidth: 1000,
  },
}));
