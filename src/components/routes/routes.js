import LoginLayout from "../LoginLayout";
import PrivateRoute from "./PrivateRoute";
import ActionsPage from "../ActionsPage";
import Home from "../Home";
import Dictionary from "../Dictionary";
import Exercises from "../Exercises";
import Settings from "../Settings";

import { ROUTES } from "../../constants";
import React from "react";

export const openRoutes = [
  { path: ROUTES.login, component: <LoginLayout /> },
  { path: ROUTES.register, component: <LoginLayout /> },
  { path: ROUTES.home, component: <Home /> },
];

export const privateRoutes = [
  { path: ROUTES.user, component: <PrivateRoute component={ActionsPage} /> },
  {
    path: ROUTES.dictionary,
    component: <PrivateRoute component={Dictionary} />,
  },
  {
    path: ROUTES.exercises,
    component: <PrivateRoute component={Exercises} />,
  },
  {
    path: ROUTES.settings,
    component: <PrivateRoute component={Settings} />,
  },
];
