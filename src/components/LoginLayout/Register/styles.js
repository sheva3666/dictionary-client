import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  success: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 70,
  },
  message: {
    textAlign: "center",
    fontWeight: "bold",
  },
}));
