// Layout: header con navegacion segun la sesion + footer. Al navegar solo cambia lo que renderiza <Outlet />.
import { Link, NavLink, Outlet } from "react-router";
import { signOut, useSession } from "../lib/auth-client";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

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
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white shadow">
              🚗
            </span>
            <span className="text-lg font-bold text-slate-900">
              Auto<span className="text-brand-600">Market</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Catalogo
            </NavLink>
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" end className={navClass}>
                  Panel admin
                </NavLink>
                <NavLink to="/admin/usuarios" className={navClass}>
                  Usuarios
                </NavLink>
              </>
            )}
            {user ? (
              <div className="ml-1 flex items-center gap-1 border-l border-slate-200 pl-2">
                <NavLink to="/perfil" className={navClass}>
                  <span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  {user.name}
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="ml-1 flex items-center gap-2">
                <NavLink to="/login" className={navClass}>
                  Ingresar
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-semibold text-slate-700">AutoMarket</span> · Autos 0 km y usados
          </p>
          <p>TP 2 · Metodologias y Desarrollos Web · UAI 2026</p>
        </div>
      </footer>
    </div>
  );
};
