import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  emailInput: {
    padding: "7px 10px",
    borderRadius: 5,
    fontWeight: 400,
    fontSize: 20,
  },
  label: {
    color: "#00316B",
    fontWeight: "bold",
    fontSize: 24,
  },
  passwordInput: {
    padding: "7px 10px",
    borderRadius: 5,
    fontWeight: 400,
    fontSize: 20,
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
  settings: {
    width: 300,
    paddingTop: 10,
    paddingBottom: 10,
  },

  customColor: {
    border: "2px solid #00316B",
  },
  "@media only screen and (max-width: 900px)": {
    label: {
      fontWeight: "bold",
      fontSize: 20,
    },
  },
}));
