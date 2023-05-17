import { Routes, Route } from "react-router-dom";
import { openRoutes, privateRoutes } from "./components/routes/routes";
import "./App.css";

function App() {
  return (
    <Routes>
      {openRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
      {privateRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
}

export default App;
