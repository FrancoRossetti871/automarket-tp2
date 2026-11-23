// Layout: header con navegacion segun la sesion. Al navegar solo cambia lo que renderiza <Outlet />.
import { Link, NavLink, Outlet } from "react-router";
import { signOut, useSession } from "../lib/auth-client";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-1.5 text-sm hover:bg-white/10 ${isActive ? "bg-white/15" : ""}`;

export const Layout = () => {
  const { data: session } = useSession();
  const user = session?.user;

  // signOut borra la sesion EN LA BASE (no solo la cookie).
  // Recarga completa a la pagina de inicio: limpia la cache de useSession y de RTK Query.
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      alert(error.message ?? "No se pudo cerrar sesion");
      return;
    }
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-brand-600 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold">
            🚗 Autos
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={navClass}>
              Catalogo
            </NavLink>
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" end className={navClass}>
                  Admin
                </NavLink>
                <NavLink to="/admin/usuarios" className={navClass}>
                  Usuarios
                </NavLink>
              </>
            )}
            {user ? (
              <>
                <NavLink to="/perfil" className={navClass}>
                  {user.name}
                </NavLink>
                <button type="button" onClick={handleLogout} className="rounded px-3 py-1.5 text-sm hover:bg-white/10">
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Ingresar
                </NavLink>
                <NavLink to="/register" className="rounded bg-white px-3 py-1.5 text-sm font-medium text-brand-700">
                  Crear cuenta
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
};
