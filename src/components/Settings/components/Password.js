import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";

import useLocalStorage from "../../../hooks/useLocalStorage";
import { LongButton } from "../../common/Buttons";
import { PasswordInput } from "../../common/Inputs";
import { ErrorMessage } from "../../common/Messages";

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword(
    $user: String!
    $password: String!
    $newPassword: String!
  ) {
    updatePassword(user: $user, password: $password, newPassword: $newPassword)
  }
`;

const Password = () => {
  const { getItem } = useLocalStorage();
  const navigate = useNavigate();
  const user = getItem("user");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwords, setPasswords] = useState({
    email: user.email,
    password: "",
    newPassword: "",
  });

  const [updatePassword, { error }] = useMutation(UPDATE_PASSWORD);

  const handlePasswordInputChange = (value) => {
    setPasswords({ ...passwords, password: value });
  };

  const handleNewPasswordInputChange = (value) => {
    setPasswords({ ...passwords, newPassword: value });
  };

  const handleConfirmPasswordInputChange = (value) => {
    setPasswordConfirm(value);
  };
  const onSavePassword = async () => {
    try {
      await updatePassword({
        variables: {
          user: passwords.email,
          password: passwords.password,
          newPassword: passwords.newPassword,
        },
      })
        .then(setPasswords({ ...passwords, password: "", newPassword: "" }))
        .then(() => navigate(ROUTES.user));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {error && <ErrorMessage message={error.message} />}

      <PasswordInput
        value={passwords.password}
        label="Your password"
        onChange={handlePasswordInputChange}
        placeholder="Enter your password for confirm"
        settings
      />
      <PasswordInput
        value={passwords.newPassword}
        label="New password"
        onChange={handleNewPasswordInputChange}
        placeholder="Enter new password"
        settings
      />
      <PasswordInput
        value={passwordConfirm}
        label="Confirm new password"
        onChange={handleConfirmPasswordInputChange}
        placeholder="Enter new password for confirm"
        settings
      />
      <LongButton
        settngsWidth
        onClick={(e) => onSavePassword(e)}
        name="Save changes"
      />
    </>
  );
};

export default Password;
