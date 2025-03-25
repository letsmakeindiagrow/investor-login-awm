import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import appRouter from "./router";
import "./index.css";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);
