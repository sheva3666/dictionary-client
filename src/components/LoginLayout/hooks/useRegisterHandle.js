import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
// import CREATE_USER from "../../../graphql/mutations/CreateUser.graphql";
const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      id
      email
      password
      languageForLearn
      language
    }
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
    !registerUser.languageForLearn;

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const navigate = useNavigate();

  const onRegister = async (e) => {
    e.preventDefault();
    await createUser({
      variables: { user: registerUser },
    });
    !error && navigate(ROUTES.login);
  };

  console.log(registerUser);

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
    error,
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
