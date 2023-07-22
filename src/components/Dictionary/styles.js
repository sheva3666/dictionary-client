import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  title: {
    color: "#fff",
    fontSize: 64,
  },
  buttonsContainer: {
    display: "flex",
    gap: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: [60, 60],
    background: "#fff",
    borderRadius: 30,
    width: "60%",
    height: "80%",
  },
  buttonContainer: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
  },
  dictionary: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
}));
