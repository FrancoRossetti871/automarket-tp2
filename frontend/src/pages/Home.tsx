// Ruta publica "/": portada + catalogo con busqueda, filtro, orden y paginacion (resueltos en el backend).
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../lib/api";
import { useGetCarsQuery } from "../store/api";
import { CarCard } from "../components/CarCard";
import { CarCardSkeleton } from "../components/Skeleton";
import { Pagination } from "../components/Pagination";
import type { CarsQueryParams } from "../types/car";

const PAGE_SIZE = 6;

const sortOptions = {
  recent: { label: "Mas recientes", sortBy: "createdAt", sortOrder: "desc" },
  priceAsc: { label: "Menor precio", sortBy: "price", sortOrder: "asc" },
  priceDesc: { label: "Mayor precio", sortBy: "price", sortOrder: "desc" },
  yearDesc: { label: "Mas nuevos", sortBy: "year", sortOrder: "desc" },
} as const;
type SortKey = keyof typeof sortOptions;

const conditionTabs = [
  { value: "", label: "Todos" },
  { value: "false", label: "0 km" },
  { value: "true", label: "Usados" },
] as const;

export const Home = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [used, setUsed] = useState<"" | "true" | "false">("");
  const [sort, setSort] = useState<SortKey>("recent");

  const { sortBy, sortOrder } = sortOptions[sort];
  const params: CarsQueryParams = {
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
    ...(search && { search }),
    ...(used && { used }),
  };
  const { data, isFetching, isLoading, error } = useGetCarsQuery(params);

  // Contadores de la portada: piden 1 solo registro y usan meta.total.
  const { data: all } = useGetCarsQuery({ limit: 1 });
  const { data: news } = useGetCarsQuery({ limit: 1, used: "false" });
  const { data: useds } = useGetCarsQuery({ limit: 1, used: "true" });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setUsed("");
    setSort("recent");
    setPage(1);
  };

  const stats = [
    { label: "Autos disponibles", value: all?.meta.total },
    { label: "0 km", value: news?.meta.total },
    { label: "Usados", value: useds?.meta.total },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Portada */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-slate-900 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Concesionaria online
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Encontra tu proximo auto</h1>
          <p className="mt-3 text-base text-blue-100 sm:text-lg">
            0 km y usados seleccionados, con precio y kilometraje claros. Busca, compara y elegi el tuyo.
          </p>
        </div>
        <dl className="relative mt-8 grid max-w-xl grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <dd className="text-2xl font-bold sm:text-3xl">{stat.value ?? "—"}</dd>
              <dt className="text-xs text-blue-100 sm:text-sm">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Filtros */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              placeholder="Buscar por marca, modelo o descripcion..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pr-3 pl-10 focus:border-brand-600 focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-700"
          >
            Buscar
          </button>
        </form>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Filtrar por condicion">
            {conditionTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={used === tab.value}
                onClick={() => {
                  setUsed(tab.value);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  used === tab.value ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-900"
            >
              {Object.entries(sortOptions).map(([key, option]) => (
                <option key={key} value={key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Resultados */}
      <section className="flex flex-col gap-5">
        {data && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{data.meta.total}</span>{" "}
              {data.meta.total === 1 ? "auto encontrado" : "autos encontrados"}
              {search && (
                <>
                  {" "}
                  para <span className="font-medium text-slate-900">"{search}"</span>
                </>
              )}
            </p>
            {(search || used || sort !== "recent") && (
              <button type="button" onClick={clearFilters} className="text-sm font-medium text-brand-600 hover:underline">
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-red-700">No se pudieron cargar los autos: {getErrorMessage(error)}</p>
        )}

        {data && data.data.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-4xl" aria-hidden="true">
              🚘
            </p>
            <p className="mt-2 font-medium text-slate-900">No hay autos que coincidan con la busqueda</p>
            <button type="button" onClick={clearFilters} className="mt-2 text-sm text-brand-600 hover:underline">
              Ver todo el catalogo
            </button>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className={`grid gap-5 transition sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
              {data.data.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
};
