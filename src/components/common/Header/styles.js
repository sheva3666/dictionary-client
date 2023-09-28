import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonContainer: {
    display: "flex",
    gap: 20,
    alignItems: "center",
  },
  score: {
    color: "#fff",
    marginLeft: 100,
  },
  "@media only screen and (max-width: 900px)": {
    header: {
      padding: "10px 5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    score: {
      marginLeft: 0,
      fontSize: 9,
    },
  },
}));
