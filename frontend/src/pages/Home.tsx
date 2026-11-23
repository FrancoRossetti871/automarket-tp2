// Ruta publica "/": portada + catalogo con busqueda, filtros, orden y paginacion (resueltos en el backend).
import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../lib/api";
import { formatPrice } from "../lib/format";
import { bodyTypeLabels, fuelLabels } from "../lib/car-labels";
import { useGetCarsQuery } from "../store/api";
import { CarCard } from "../components/CarCard";
import { CarVisual } from "../components/CarVisual";
import { CarCardSkeleton } from "../components/Skeleton";
import { Pagination } from "../components/Pagination";
import { Icon, type IconName } from "../components/Icon";
import { BODY_TYPES, FUELS, type BodyType, type CarsQueryParams, type Fuel } from "../types/car";

const PAGE_SIZE = 6;

const sortOptions = {
  recent: { label: "Mas recientes", sortBy: "createdAt", sortOrder: "desc" },
  priceAsc: { label: "Menor precio", sortBy: "price", sortOrder: "asc" },
  priceDesc: { label: "Mayor precio", sortBy: "price", sortOrder: "desc" },
  yearDesc: { label: "Mas nuevos", sortBy: "year", sortOrder: "desc" },
  powerDesc: { label: "Mas potentes", sortBy: "horsepower", sortOrder: "desc" },
} as const;
type SortKey = keyof typeof sortOptions;

const conditionTabs = [
  { value: "", label: "Todos" },
  { value: "false", label: "0 km" },
  { value: "true", label: "Usados" },
] as const;

const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Unidades verificadas", text: "Cada auto pasa por una revision mecanica y de documentacion antes de publicarse." },
  { icon: "wallet", title: "Transparencia total", text: "Precio final, ficha tecnica y kilometraje real a la vista, sin letra chica." },
  { icon: "handshake", title: "Asesoramiento personal", text: "Te acompañamos en todo el proceso, desde la eleccion hasta la entrega." },
];

const selectClass =
  "rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 transition hover:border-zinc-400 focus:border-zinc-950 focus:outline-none";

export const Home = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [used, setUsed] = useState<"" | "true" | "false">("");
  const [fuel, setFuel] = useState<"" | Fuel>("");
  const [bodyType, setBodyType] = useState<"" | BodyType>("");
  const [sort, setSort] = useState<SortKey>("recent");
  const catalogRef = useRef<HTMLDivElement>(null);

  const { sortBy, sortOrder } = sortOptions[sort];
  const params: CarsQueryParams = {
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
    ...(search && { search }),
    ...(used && { used }),
    ...(fuel && { fuel }),
    ...(bodyType && { bodyType }),
  };
  const { data, isFetching, isLoading, error } = useGetCarsQuery(params);

  // Contadores de la portada: piden 1 solo registro y usan meta.total.
  const { data: all } = useGetCarsQuery({ limit: 1 });
  const { data: news } = useGetCarsQuery({ limit: 1, used: "false" });
  const { data: useds } = useGetCarsQuery({ limit: 1, used: "true" });
  // Auto destacado de la portada: el de mayor precio del catalogo.
  const { data: top } = useGetCarsQuery({ limit: 1, sortBy: "price", sortOrder: "desc" });
  const featured = top?.data[0];

  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
    scrollToCatalog();
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setUsed("");
    setFuel("");
    setBodyType("");
    setSort("recent");
    setPage(1);
  };

  const hasFilters = Boolean(search || used || fuel || bodyType || sort !== "recent");

  const stats = [
    { label: "Unidades", value: all?.meta.total },
    { label: "0 km", value: news?.meta.total },
    { label: "Usados", value: useds?.meta.total },
  ];

  return (
    <div className="flex flex-col gap-16">
      {/* Portada */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl shadow-black/20">
        {/* Foto del auto destacado de fondo, fundida con el negro */}
        {featured?.imageUrl && (
          <div className="absolute inset-y-0 right-0 hidden w-[62%] overflow-hidden lg:block" aria-hidden="true">
            <img src={featured.imageUrl} alt="" className="animate-kenburns h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(255_255_255/0.08),transparent_55%)]" aria-hidden="true" />

        <div className="relative px-6 py-14 sm:px-12 sm:py-20 lg:py-24">
          <div className="max-w-xl">
            <p className="animate-fade-up flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-zinc-400 uppercase">
              <span className="h-px w-8 bg-zinc-500" aria-hidden="true" />
              Concesionaria online
            </p>
            <h1 className="animate-fade-up mt-6 text-4xl leading-[1.05] font-semibold tracking-tight [animation-delay:120ms] sm:text-6xl">
              Tu proximo auto,
              <br />
              <span className="text-silver animate-sheen">sin vueltas.</span>
            </h1>
            <p className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-zinc-400 [animation-delay:240ms] sm:text-lg">
              Unidades 0 km y usadas seleccionadas, con ficha tecnica completa y precios claros.
            </p>

            <form
              onSubmit={handleSearch}
              className="animate-fade-up mt-9 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 pl-5 backdrop-blur-md [animation-delay:360ms]"
            >
              <label className="flex flex-1 items-center gap-3">
                <span className="sr-only">Buscar autos</span>
                <Icon name="search" size={18} className="text-zinc-400" />
                <input
                  type="search"
                  placeholder="Marca, modelo o motor"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent py-2 text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </label>
              <button type="submit" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">
                Buscar
              </button>
            </form>

            <dl className="animate-fade-up mt-12 flex gap-10 border-t border-white/10 pt-6 [animation-delay:480ms]">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-3xl font-semibold tabular-nums">{stat.value ?? "—"}</dd>
                  <dt className="mt-1 text-xs tracking-[0.2em] text-zinc-500 uppercase">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {featured && (
            <Link
              to={`/cars/${featured._id}`}
              className="animate-fade-in group absolute right-8 bottom-8 hidden items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-3 pr-5 backdrop-blur-md transition hover:border-white/25 lg:flex [animation-delay:700ms]"
            >
              <div className="h-14 w-20 overflow-hidden rounded-xl">
                <CarVisual brand={featured.brand} modelName={featured.modelName} imageUrl={featured.imageUrl} size="sm" />
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.25em] text-zinc-400 uppercase">Destacado</p>
                <p className="font-medium">
                  {featured.brand} {featured.modelName}
                </p>
                <p className="text-sm text-zinc-400">{formatPrice(featured.price)}</p>
              </div>
              <Icon name="arrowRight" size={18} className="ml-2 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          )}
        </div>
      </section>

      {/* Catalogo */}
      <section ref={catalogRef} className="flex scroll-mt-24 flex-col gap-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">Stock disponible</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Catalogo</h2>
              {data && (
                <p className="mt-2 text-sm text-zinc-500">
                  {data.meta.total} {data.meta.total === 1 ? "unidad" : "unidades"}
                  {search && (
                    <>
                      {" "}
                      para <span className="font-medium text-zinc-900">"{search}"</span>
                    </>
                  )}
                  {hasFilters && (
                    <button type="button" onClick={clearFilters} className="ml-3 font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600">
                      Limpiar filtros
                    </button>
                  )}
                </p>
              )}
            </div>
            <div className="inline-flex rounded-full border border-zinc-300 bg-white p-1" role="group" aria-label="Filtrar por condicion">
              {conditionTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  aria-pressed={used === tab.value}
                  onClick={() => {
                    setUsed(tab.value);
                    setPage(1);
                  }}
                  className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
                    used === tab.value ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-y border-zinc-200 py-4">
            <select
              aria-label="Filtrar por combustible"
              value={fuel}
              onChange={(e) => {
                setFuel(e.target.value as "" | Fuel);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">Combustible</option>
              {FUELS.map((value) => (
                <option key={value} value={value}>
                  {fuelLabels[value]}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrar por carroceria"
              value={bodyType}
              onChange={(e) => {
                setBodyType(e.target.value as "" | BodyType);
                setPage(1);
              }}
              className={selectClass}
            >
              <option value="">Carroceria</option>
              {BODY_TYPES.map((value) => (
                <option key={value} value={value}>
                  {bodyTypeLabels[value]}
                </option>
              ))}
            </select>
            <select
              aria-label="Ordenar"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
              }}
              className={`${selectClass} sm:ml-auto`}
            >
              {Object.entries(sortOptions).map(([key, option]) => (
                <option key={key} value={key}>
                  Ordenar: {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            No se pudieron cargar los autos: {getErrorMessage(error)}
          </p>
        )}

        {data && data.data.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-zinc-200 bg-white p-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
              <Icon name="search" size={24} />
            </span>
            <p className="mt-5 font-medium text-zinc-950">No hay unidades que coincidan con la busqueda</p>
            <p className="mt-1 text-sm text-zinc-500">Proba con otra marca o quita los filtros.</p>
            <button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800">
              Ver todo el catalogo
            </button>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className={`grid gap-6 transition sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
              {data.data.map((car, i) => (
                <CarCard key={car._id} car={car} index={i} />
              ))}
            </div>
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              onChange={(p) => {
                setPage(p);
                scrollToCatalog();
              }}
            />
          </>
        )}
      </section>

      {/* Beneficios */}
      <section className="overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-white sm:px-12">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">La experiencia AutoMarket</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Comprar un auto, <span className="text-silver">como tiene que ser.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="group bg-zinc-950 p-8 transition duration-500 hover:bg-zinc-900">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition duration-500 group-hover:border-white/40 group-hover:text-white">
                <Icon name={benefit.icon} size={20} strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 font-medium text-white">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
