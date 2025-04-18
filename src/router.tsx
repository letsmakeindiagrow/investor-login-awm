import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Placeholder from "./pages/Placeholder";
import RegistrationForm from "./components/Registration";
import Login from "./pages/Login";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Wrap everything inside App
    children: [

      { path: "/register", element: <RegistrationForm /> },
      { path: "/", element: <Login /> },
    ],
  },
]);

export default appRouter;
