import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../lib/auth-client";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  roles?: UserRole[];
}

// Sin sesion -> /login (y despues vuelve a donde queria ir).
// Con sesion pero sin el rol -> /sin-permisos.
export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  // isPending: true hasta que responde /api/auth/get-session.
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return <p className="text-zinc-500">Verificando sesion...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(session.user.role as UserRole)) {
    return <Navigate to="/sin-permisos" replace />;
  }

  return <Outlet />;
};
