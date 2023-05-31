import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  exercises: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "100px 20px",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 70,
    marginTop: "80px",
    fontWeight: 600,
    fontSize: 32,
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  loadingContainer: {
    display: "flex",
    margin: "0 auto",
  },
}));
