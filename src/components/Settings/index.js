import React, { useState } from "react";

import Header from "../common/Header";
import { DoubleButton } from "../common/Buttons";
import Title from "../common/Title";

import useStyles from "./styles";
import Languages from "./components/Languages";
import Password from "./components/Password";

const buttons = {
  firstName: "Change language",
  secondName: "Change password",
};

const onChangeLayout = (selectedButton, setSelectedButton) => {
  if (selectedButton === buttons.firstName) {
    setSelectedButton(buttons.secondName);
  } else {
    setSelectedButton(buttons.firstName);
  }
};

const Settings = () => {
  const [selectedButton, setSelectedButton] = useState(buttons.firstName);
  const classes = useStyles();

  return (
    <>
      <Header />
      <div className={classes.container}>
        <Title title="Settings" />
        <DoubleButton
          selectedButton={selectedButton}
          firstName={buttons.firstName}
          secondName={buttons.secondName}
          onClick={() => onChangeLayout(selectedButton, setSelectedButton)}
        />
        {selectedButton === buttons.firstName && <Languages />}
        {selectedButton === buttons.secondName && <Password />}
      </div>
      ;
    </>
  );
};

export default Settings;
