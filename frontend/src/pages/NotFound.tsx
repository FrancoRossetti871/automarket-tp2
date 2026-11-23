import { Link } from "react-router";
import { Icon } from "../components/Icon";

export const NotFound = () => {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
        <Icon name="search" size={30} />
      </span>
      <p className="mt-6 text-sm font-semibold text-zinc-950">Error 404</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">Pagina no encontrada</h1>
      <p className="mt-3 text-zinc-500">La pagina que buscas no existe o fue movida.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700"
      >
        <Icon name="arrowLeft" size={16} />
        Volver al catalogo
      </Link>
    </section>
  );
};
