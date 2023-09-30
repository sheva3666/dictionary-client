import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  container: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },
  "@media only screen and (max-width: 900px)": {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      marginBottom: 20,
    },
  },
}));
