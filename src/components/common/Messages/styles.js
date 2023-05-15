import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  emailInput: {
    padding: "5px 10px",
    borderRadius: 5,
  },
  passwordInput: {
    padding: "5px 10px",
    borderRadius: 5,
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
