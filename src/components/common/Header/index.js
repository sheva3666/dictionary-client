import React from "react";
import { BackButton, IconButton } from "../Buttons";
import useStyles from "./styles";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import Settings from "./images/Settings.png";

const Header = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <BackButton name="< Back" onClick={() => navigate(ROUTES.user)} />
      <IconButton onClick={() => navigate(ROUTES.settings)} icon={Settings} />
    </div>
  );
};

export default Header;
