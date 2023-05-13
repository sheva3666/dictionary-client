import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "./components/Box";
import { ACTIONS } from "./constants";
import useStyles from "./styles";

const ActionsPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className={classes.container}>
      {ACTIONS.map(({ icon, text }) => (
        <Box
          onClick={() => navigate()}
          key={text}
          icon={icon}
          text={text}
          classes={classes}
        />
      ))}
    </div>
  );
};

export default ActionsPage;
