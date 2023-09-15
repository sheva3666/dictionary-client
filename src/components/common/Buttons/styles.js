import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  secondaryButton: {
    color: "#fff",
    padding: [15, 62],
    borderRadius: 20,
    border: "3px solid #fff",
    background: "transparent",
    cursor: "pointer",
    fontSize: 32,
    "&:hover": {
      background: "#0752AA",
    },
  },

  primaryButton: {
    color: "#fff",
    padding: [15, 62],
    borderRadius: 20,
    border: "none",
    background:
      "linear-gradient(175deg, rgba(0,117,255,1) 0%, rgba(7,82,170,0.6) 100%, rgba(33,33,208,1) 100%, rgba(0,212,255,1) 100%)",
    cursor: "pointer",
    fontSize: 32,
    "&:hover": {
      background:
        "linear-gradient(175deg, rgba(254,254,254,1) 0%, rgba(61,146,245,0.6) 100%, rgba(33,33,208,1) 100%, rgba(0,212,255,1) 100%)",
      color: "#00316B",
    },
  },

  longButton: {
    color: "#fff",
    padding: [15, 145],
    borderRadius: 5,
    border: "none",
    background: "#0752AA",
    cursor: "pointer",
    fontSize: 16,
    "&:hover": {
      background: "#00316B",
    },
  },

  betterSize: {
    fontSize: 20,
    padding: [5, 20],
    border: "3px solid #00316B",
  },

  exerciseColor: {
    color: "#00316B",
    borderRadius: 20,
    border: "2px solid",
    "&:hover": {
      background: "#00316B",
      color: "#fff",
      border: "2px solid #fff",
    },
  },

  disabled: {
    background: "grey",
    "&:hover": {
      background: "grey",
    },
  },
  width: {
    width: 300,
  },
  green: {
    background: "green",
    color: "#fff",
  },
  red: {
    background: "red",
    color: "#fff",
  },

  backButton: {
    color: "#fff",
    padding: [5, 20],
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  iconButton: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    padding: [5, 20],
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  marginTop: {
    marginTop: 50,
  },

  exerciseStyle: {
    borderRadius: 20,
    margin: "0 auto",
  },

  hidden: {
    opacity: 0,
    cursor: "none",
  },

  settngsWidth: {
    padding: [15, 113],
  },
}));
