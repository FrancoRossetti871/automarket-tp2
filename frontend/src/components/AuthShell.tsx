// Marco comun de Login y Register: panel con foto a la izquierda (en pantallas grandes) y el form a la derecha.
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => {
  return (
    <main className="grid min-h-screen bg-white font-sans lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img src="/cars/ford-ranger.png" alt="" className="animate-kenburns absolute inset-0 h-full w-full object-cover opacity-35 grayscale" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" aria-hidden="true" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative animate-fade-up">
          <img src="/logo.png" alt="" width={88} height={88} className="mb-10 h-22 w-22 rounded-2xl bg-black shadow-2xl ring-1 ring-white/15" />
          <h2 className="max-w-md text-4xl leading-tight font-semibold tracking-tight">
            Tu proximo auto
            <br />
            <span className="text-silver animate-sheen">te esta esperando.</span>
          </h2>
          <ul className="mt-10 space-y-3 text-sm text-zinc-300">
            {["Catalogo actualizado al instante", "Ficha tecnica completa de cada unidad", "Ingreso con email o GitHub"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/25">
                  <Icon name="check" size={11} strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs tracking-wider text-zinc-500">© 2026 AutoMarket · Proyecto academico</p>
      </aside>

      <section className="flex items-center justify-center bg-zinc-50 p-6 lg:bg-white">
        <div className="animate-fade-up w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] text-zinc-500 uppercase transition hover:text-zinc-950">
            <Icon name="arrowLeft" size={14} />
            Volver al catalogo
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">{title}</h1>
          <p className="mt-2 mb-8 text-sm text-zinc-500">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
};
