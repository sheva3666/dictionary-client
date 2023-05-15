import { ROUTES } from "../../constants";
import LoginLayout from "../LoginLayout";
import PrivateRoute from "./PrivateRoute";
import ActionsPage from "../ActionsPage";
import Home from "../Home";
import Dictionary from "../Dictionary";
import Exercises from "../Exercises";

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
];
