import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  box: {
    display: "flex",
    flexGrow: 1,
    flexBasis: 200,
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
    width: 170,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
    color: "#0752AA",
  },
  icon: {
    width: "50%",
    height: "100%",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding: 20,
    gap: 20,
    margin: "auto",
    marginTop: 200,
    maxWidth: 1200,
  },
  "@media only screen and (max-width: 900px)": {
    container: {
      marginTop: 100,
    },
  },
}));
