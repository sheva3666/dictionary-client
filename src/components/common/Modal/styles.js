import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  modal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    left: 200,
    top: 150,
    width: "900px",
    height: "500px",
    overflow: "auto",
    backgroundColor: "#fff",
    borderRadius: 30,
  },
}));
