import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Placeholder from "./pages/Placeholder";
import RegistrationForm from "./components/Registration";
export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Wrap everything inside App
    children: [
      { path: "/", element: <Placeholder /> }, // Home page
      { path: "/register", element: <RegistrationForm /> },
    ],
  },
]);

export default appRouter;
