import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants";

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

const whenLoged = (navigate, data, loading) => {
  if (!loading) {
    data && localStorage.setItem("user", JSON.stringify(data));
    data && navigate(ROUTES.user);
  }
};

const useLoginHandle = () => {
  const navigate = useNavigate();
  const [user, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

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
      });
    } catch (error) {
      console.log(error);
    }
    setLoginUser({ email: "", password: "" });
    whenLoged(navigate, data?.loginUser, loading);
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
