// Layout: header con navegacion segun la sesion + footer. Al navegar solo cambia lo que renderiza <Outlet />.
import { Link, NavLink, Outlet } from "react-router";
import { signOut, useSession } from "../lib/auth-client";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { AnimatedBackground } from "../components/AnimatedBackground";

// Link activo: texto negro con una linea fina debajo (estilo sobrio, sin "pastillas" de color).
const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition after:absolute after:inset-x-3 after:-bottom-px after:h-px after:transition ${
    isActive
      ? "text-zinc-950 after:bg-zinc-950"
      : "text-zinc-500 after:bg-transparent hover:text-zinc-950"
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
    <div className="relative isolate flex min-h-screen flex-col font-sans">
      <AnimatedBackground />
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="flex flex-wrap items-center gap-1" aria-label="Principal">
            <NavLink to="/" end className={navClass}>
              Catalogo
            </NavLink>
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" end className={navClass}>
                  <Icon name="lock" size={15} />
                  Panel admin
                </NavLink>
                <NavLink to="/admin/usuarios" className={navClass}>
                  <Icon name="users" size={15} />
                  Usuarios
                </NavLink>
              </>
            )}
            {user ? (
              <div className="ml-2 flex items-center gap-1 border-l border-zinc-200 pl-3">
                <NavLink to="/perfil" className={navClass}>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white ring-2 ring-zinc-200">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate">{user.name}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
                >
                  <Icon name="logout" size={15} />
                  Salir
                </button>
              </div>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <NavLink to="/login" className={navClass}>
                  Ingresar
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="relative mt-16 bg-zinc-950 text-zinc-400">
        <div className="hairline absolute inset-x-0 top-0 h-px" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Catalogo online de autos 0 km y usados. Ficha tecnica completa, precio y kilometraje claros.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-zinc-200 uppercase">Navegacion</h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Catalogo
                </Link>
              </li>
              {!user && (
                <>
                  <li>
                    <Link to="/login" className="transition hover:text-white">
                      Ingresar
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="transition hover:text-white">
                      Crear cuenta
                    </Link>
                  </li>
                </>
              )}
              {user && (
                <li>
                  <Link to="/perfil" className="transition hover:text-white">
                    Mi perfil
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-zinc-200 uppercase">Atencion</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Icon name="clock" size={16} className="text-zinc-500" />
                Lunes a viernes, 9 a 18 h
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="mapPin" size={16} className="text-zinc-500" />
                Showroom en Buenos Aires
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:justify-between sm:px-6">
            <p>© 2026 AutoMarket. Proyecto academico.</p>
            <p>Metodologias y Desarrollos Web · UAI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
