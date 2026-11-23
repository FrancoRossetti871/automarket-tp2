// Ruta publica "/": catalogo con busqueda, filtro y paginacion (resueltos en el backend).
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../lib/api";
import { useGetCarsQuery } from "../store/api";
import { CarCard } from "../components/CarCard";
import { Pagination } from "../components/Pagination";
import type { CarsQueryParams } from "../types/car";

const PAGE_SIZE = 6;

export const Home = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [used, setUsed] = useState<"" | "true" | "false">("");

  const params: CarsQueryParams = { page, limit: PAGE_SIZE, ...(search && { search }), ...(used && { used }) };
  const { data, isFetching, isLoading, error } = useGetCarsQuery(params);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Catalogo de autos</h2>
        <p className="text-slate-600">Autos 0 km y usados disponibles en la concesionaria.</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar por marca, modelo o descripcion..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 rounded border border-slate-300 bg-white px-3 py-2"
        />
        <select
          value={used}
          onChange={(e) => {
            setUsed(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
          className="rounded border border-slate-300 bg-white px-3 py-2"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos</option>
          <option value="false">0 km</option>
          <option value="true">Usados</option>
        </select>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700">
          Buscar
        </button>
      </form>

      {isLoading && <p className="text-slate-500">Cargando autos...</p>}

      {error && <p className="text-red-600">No se pudieron cargar los autos: {getErrorMessage(error)}</p>}

      {data && data.data.length === 0 && <p className="text-slate-500">No hay autos que coincidan con la busqueda.</p>}

      {data && data.data.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            {data.meta.total} {data.meta.total === 1 ? "auto encontrado" : "autos encontrados"}
          </p>
          <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {data.data.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />
        </>
      )}
    </section>
  );
};
