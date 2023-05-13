import { ROUTES } from "../../constants";
import LoginLayout from "../LoginLayout";
import PrivateRoute from "./PrivateRoute";
import ActionsPage from "../ActionsPage";
import Home from "../Home";

export const openRoutes = [
  { path: ROUTES.login, component: <LoginLayout /> },
  { path: ROUTES.register, component: <LoginLayout /> },
  { path: ROUTES.home, component: <Home /> },
];

export const privateRoutes = [
  { path: ROUTES.user, component: <PrivateRoute component={ActionsPage} /> },
  //   { route: ROUTES.words, component: <PrivateRoute /> },
];
