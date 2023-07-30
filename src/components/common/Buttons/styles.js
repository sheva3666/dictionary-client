import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  secondaryButton: {
    color: "#fff",
    padding: "15px 62px",
    borderRadius: 5,
    border: "1px solid #0075FF",
    background: "transparent",
    cursor: "pointer",
    fontSize: 32,
    "&:hover": {
      background: "#0752AA",
    },
  },

  primaryButton: {
    color: "#fff",
    padding: "15px 62px",
    borderRadius: 5,
    border: "1px solid #0075FF",
    background: "#0752AA",
    cursor: "pointer",
    fontSize: 32,
    "&:hover": {
      background: "#00316B",
    },
  },

  longButton: {
    color: "#fff",
    padding: "15px 145px",
    borderRadius: 5,
    border: "none",
    background: "#0752AA",
    cursor: "pointer",
    fontSize: 16,
    "&:hover": {
      background: "#00316B",
    },
  },

  betterSize: {
    fontSize: 20,
    padding: "5px 20px",
    border: "3px solid #00316B",
  },

  exerciseColor: {
    color: "#00316B",
  },

  disabled: {
    background: "grey",
    "&:hover": {
      background: "grey",
    },
  },
  width: {
    width: 300,
  },
  green: {
    background: "green",
  },
  red: {
    background: "red",
  },

  backButton: {
    color: "#fff",
    padding: "5px 20px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  iconButton: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    padding: "5px 20px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  marginTop: {
    marginTop: 50,
  },

  exerciseWidth: {
    width: 500,
    margin: "0 auto",
  },
}));
