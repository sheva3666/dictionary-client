import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  formContainer: {
    display: "flex",
    gap: 20,
  },
  "@media only screen and (max-width: 900px)": {
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      marginBottom: 20,
    },
  },
}));
