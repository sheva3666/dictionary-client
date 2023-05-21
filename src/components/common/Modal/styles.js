import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  modal: {
    display: "flex",
    padding: "20px 20px",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
    maxWidth: "900px",
    maxHeight: "500px",
    overflow: "auto",
    backgroundColor: "#fff",
    borderRadius: 30,
  },

  footer: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "20px 20px",
  },
}));
