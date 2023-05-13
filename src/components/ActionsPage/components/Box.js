import React from "react";

const Box = ({ classes, icon, text, onClick }) => {
  return (
    <div onClick={onClick} className={classes.box}>
      <img className={classes.icon} src={icon} alt="" />
      <div className={classes.text}>{text}</div>
    </div>
  );
};

export default Box;
