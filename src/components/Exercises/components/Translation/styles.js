import { createUseStyles } from "react-jss";

export default createUseStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 60,
    margin: "20px 20px",
    "&:last-child": {
      margin: "0 auto",
    },
  },
}));
