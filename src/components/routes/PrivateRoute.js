import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../../constants";

const PrivateRoute = ({ component: Component }) => {
  const auth = true;
  return auth ? <Component /> : <Navigate to={ROUTES.login} />;
};

export default PrivateRoute;
