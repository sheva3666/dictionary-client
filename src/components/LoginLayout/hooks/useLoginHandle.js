import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../constants";
import useLocalStorage from "../../../hooks/useLocalStorage";

const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`;

const useLoginHandle = () => {
  const { setItem, getItem } = useLocalStorage();
  const navigate = useNavigate();
  const [user, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  console.log(error);

  const handleEmailInputChange = (value) => {
    setLoginUser({ ...user, email: value });
  };

  const handlePasswordInputChange = (value) => {
    setLoginUser({ ...user, password: value });
  };

  const afterLogin = (response) => {
    if (response) {
      setItem(response?.data.loginUser.token, "token");
      setItem({ email: user.email }, "user");
      setLoginUser({ email: "", password: "" });
      getItem("token") && navigate(ROUTES.user);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser({
        variables: {
          email: user.email,
          password: user.password,
        },
      }).then((res) => afterLogin(res));
    } catch (error) {
      console.log(error);
    }
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
