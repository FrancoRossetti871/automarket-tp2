// Marco comun de Login y Register: panel de marca a la izquierda (en pantallas grandes) y el form a la derecha.
import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => {
  return (
    <main className="grid min-h-screen bg-slate-50 font-sans lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <Link to="/" className="relative flex items-center gap-2 text-xl font-bold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">🚗</span>
          AutoMarket
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-extrabold tracking-tight">Tu proximo auto te esta esperando.</h2>
          <p className="mt-4 max-w-md text-blue-100">
            Explora el catalogo de 0 km y usados. Los administradores gestionan el stock desde el panel.
          </p>
        </div>
        <p className="relative text-sm text-blue-200">TP 2 · Metodologias y Desarrollos Web</p>
      </aside>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-sm text-slate-500 hover:text-brand-600">
            ← Volver al catalogo
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
};
