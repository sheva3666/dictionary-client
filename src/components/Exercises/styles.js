import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  exercises: {
    display: "flex",
    flexDirection: "column",
    gap: 70,
    alignItems: "center",
    background: "#fff",
    width: "60%",
    margin: "100px 20px",
    paddingBottom: 40,
    borderRadius: 30,
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
    alignItems: "center",
  },
  loadingContainer: {
    display: "flex",
    margin: "0 auto",
  },
}));
