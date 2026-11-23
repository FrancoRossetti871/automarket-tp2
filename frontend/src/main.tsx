import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import { store } from "./store";
import { router } from "./router";

// La sesion la maneja useSession() de Better Auth; el estado de los autos, RTK Query (store).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
