import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  select: {
    padding: "5px 10px",
    borderRadius: 5,
    border: "1px solid",
    cursor: "pointer",
    fontWeight: 400,
    fontSize: 20,
  },

  settingsSelect: {
    padding: "10px 40px",
    borderRadius: 5,
    width: 300,
    textAlign: "center",
    border: "none",
    background: "#8098B5",
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
    cursor: "pointer",
  },

  label: {
    color: "#00316B",
    fontWeight: "bold",
    fontSize: 24,
  },
}));
