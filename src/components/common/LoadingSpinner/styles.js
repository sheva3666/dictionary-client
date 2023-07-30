import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  loader: {
    border: "10px solid #f3f3f3",
    borderTop: "10px solid #3498db",
    borderRadius: "50%",
    width: 80,
    height: 80,
    animation: "spin 1s linear infinite",
  },

  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
}));
