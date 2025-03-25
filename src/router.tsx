import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Placeholder from "./pages/Placeholder";
export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Wrap everything inside App
    children: [
      { path: "/", element: <Placeholder /> }, // Home page
    ],
  },
]);

export default appRouter;
