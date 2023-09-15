import React from "react";

const Box = ({ classes, icon, text, onClick }) => {
  return (
    <div onClick={onClick} className={classes.box}>
      <img className={classes.icon} src={icon} alt="" />
      <p className={classes.text}>{text}</p>
    </div>
  );
};

export default Box;
