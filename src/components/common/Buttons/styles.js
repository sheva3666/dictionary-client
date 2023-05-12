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
}));
