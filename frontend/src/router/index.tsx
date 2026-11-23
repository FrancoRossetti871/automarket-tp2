// Arbol de rutas: publicas, privadas (sesion) y privadas por rol (admin).
import { createBrowserRouter } from "react-router";
import { Layout } from "../layouts/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Home } from "../pages/Home";
import { CarDetail } from "../pages/CarDetail";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Profile } from "../pages/Profile";
import { Admin } from "../pages/Admin";
import { Users } from "../pages/Users";
import { Forbidden } from "../pages/Forbidden";
import { NotFound } from "../pages/NotFound";

export const router = createBrowserRouter([
  // Fuera del Layout: pantalla completa, sin header
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/",
    element: <Layout />,
    children: [
      // Publicas
      { index: true, element: <Home /> },
      { path: "cars/:id", element: <CarDetail /> },
      { path: "sin-permisos", element: <Forbidden /> },

      // Privada: cualquier usuario logueado
      {
        element: <ProtectedRoute />,
        children: [{ path: "perfil", element: <Profile /> }],
      },

      // Privada por rol: solo admin
      {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [
          {
            path: "admin",
            children: [
              { index: true, element: <Admin /> },
              { path: "usuarios", element: <Users /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
