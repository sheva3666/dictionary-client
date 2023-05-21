import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";
import useLocalStorage from "../../../hooks/useLocalStorage";

const LOGIN_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      userEmail
      userAuth
      language
      languageForLearn
    }
  }
`;

const useLoginHandle = () => {
  const { setItem } = useLocalStorage();
  const navigate = useNavigate();
  const [user, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleEmailInputChange = (value) => {
    setLoginUser({ ...user, email: value });
  };

  const handlePasswordInputChange = (value) => {
    setLoginUser({ ...user, password: value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser({
        variables: {
          email: user.email,
          password: user.password,
        },
      }).then((res) =>
        localStorage.setItem("user", JSON.stringify(res?.data.loginUser))
      );
    } catch (error) {
      console.log(error);
    }
    setLoginUser({ email: "", password: "" });
    navigate(ROUTES.user);
  };

  return {
    errorMessage: error?.message,
    loading,
    handleEmailInputChange,
    handlePasswordInputChange,
    onLogin,
    user,
  };
};

export default useLoginHandle;
