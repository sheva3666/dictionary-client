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
  inputContainer: {
    display: "flex",
    gap: 5,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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

  error: {
    border: "1px solid red",
  },

  checkBox: {
    color: "#0075FF",
  },
}));
