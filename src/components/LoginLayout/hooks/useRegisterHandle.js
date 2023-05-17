import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user)
  }
`;

const useRegisterHandle = () => {
  const [checkPassword, setCheckPassword] = useState("");

  const [registerUser, setRegisterUser] = useState({
    email: "",
    password: "",
    language: "",
    languageForLearn: "",
  });

  const confirmPassword = checkPassword !== registerUser.password;
  const disabled =
    confirmPassword ||
    !registerUser.email ||
    !registerUser.password ||
    !registerUser.language ||
    !registerUser.languageForLearn ||
    registerUser.language === registerUser.languageForLearn;

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const onRegister = async (e) => {
    e.preventDefault();
    try {
      await createUser({
        variables: { user: registerUser },
      });
    } catch (error) {
      console.log(error);
    }

    setRegisterUser({
      email: "",
      password: "",
      language: "",
      languageForLearn: "",
    });
  };

  const handleCheckPasswordInputChange = (value) => {
    setCheckPassword(value);
  };

  const handleEmailInputChange = (value) => {
    setRegisterUser({ ...registerUser, email: value });
  };

  const handlePasswordInputChange = (value) => {
    setRegisterUser({ ...registerUser, password: value });
  };

  const handleLanguageSelectChange = (value) => {
    setRegisterUser({ ...registerUser, language: value });
  };

  const handleLanguageForLearnSelectChange = (value) => {
    setRegisterUser({ ...registerUser, languageForLearn: value });
  };

  return {
    errorMessage: error?.message,
    successMessage: data?.createUser,
    loading,
    checkPassword,
    registerUser,
    confirmPassword,
    disabled,
    handleCheckPasswordInputChange,
    handleEmailInputChange,
    handlePasswordInputChange,
    handleLanguageSelectChange,
    handleLanguageForLearnSelectChange,
    onRegister,
  };
};

export default useRegisterHandle;
