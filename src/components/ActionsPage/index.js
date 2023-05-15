import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import Box from "./components/Box";
import { ACTIONS } from "./constants";
import useStyles from "./styles";

const ActionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = (path) => {
    if (path) {
      return navigate(path);
    }
    setIsModalOpen(true);
  };
  return (
    <div className={classes.container}>
      {ACTIONS.map(({ icon, text, path }) => (
        <Box
          onClick={() => handleClick(path)}
          key={text}
          icon={icon}
          text={text}
          classes={classes}
        />
      ))}
      {isModalOpen && <Modal title="Please add new word to dictionary"></Modal>}
    </div>
  );
};

export default ActionsPage;
