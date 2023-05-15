import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  transperentButton: {
    color: "#fff",
    padding: "15px 62px",
    borderRadius: 20,
    border: "3px solid #fff",
    background: "transparent",
    cursor: "pointer",
    fontSize: 32,
    "&:hover": {
      background: "#0752AA",
    },
  },

  button: {
    color: "#fff",
    padding: "15px 62px",
    borderRadius: 20,
    border: "none",
    background: "#0075FF",
    cursor: "pointer",
    fontSize: 32,
    "&:hover": {
      background: "#0752AA",
    },
  },

  longButton: {
    color: "#fff",
    padding: "10px 145px",
    borderRadius: 20,
    border: "none",
    background: "#00316B",
    cursor: "pointer",
    fontSize: 16,
    "&:hover": {
      background: "#0752AA",
    },
  },

  disabled: {
    background: "grey",
    "&:hover": {
      background: "grey",
    },
  },
}));
