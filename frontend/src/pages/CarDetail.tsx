// Ruta publica "/cars/:id". El id sale de la URL con useParams.
import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useParams } from "react-router";
import { getErrorMessage } from "../lib/api";
import { formatDate, formatKm, formatPrice } from "../lib/format";
import { useGetCarByIdQuery, useGetCarsQuery } from "../store/api";
import { CarVisual } from "../components/CarVisual";
import { CarCard } from "../components/CarCard";

export const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  // skipToken = no pedir nada si no hay id.
  const { data: car, isLoading, error } = useGetCarByIdQuery(id ?? skipToken);
  // "Tambien te puede interesar": otros autos de la misma marca.
  const { data: related } = useGetCarsQuery(car ? { search: car.brand, limit: 4 } : skipToken);
  const others = related?.data.filter((c) => c._id !== car?._id).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="grid animate-pulse gap-8 md:grid-cols-2">
        <div className="h-80 rounded-3xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="h-10 w-48 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-4xl" aria-hidden="true">
          🔎
        </p>
        <p className="mt-2 text-red-600">No se pudo cargar el auto: {getErrorMessage(error)}</p>
        <Link to="/" className="mt-3 inline-block font-medium text-brand-600 hover:underline">
          ← Volver al catalogo
        </Link>
      </section>
    );
  }

  const specs = [
    { icon: "📅", label: "Año", value: String(car.year) },
    { icon: "🛣️", label: "Kilometraje", value: formatKm(car.mileage) },
    { icon: car.used ? "🔁" : "✨", label: "Condicion", value: car.used ? "Usado" : "0 km" },
    { icon: "🗓️", label: "Ingreso", value: formatDate(car.entryDate) },
  ];

  return (
    <div className="flex flex-col gap-10">
      <nav className="text-sm text-slate-500" aria-label="Ruta de navegacion">
        <Link to="/" className="hover:text-brand-600 hover:underline">
          Catalogo
        </Link>{" "}
        / <span className="text-slate-900">{car.brand} {car.modelName}</span>
      </nav>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-3xl shadow-lg sm:h-96">
          <CarVisual brand={car.brand} modelName={car.modelName} imageUrl={car.imageUrl} size="lg" />
          <span
            className={`absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-semibold shadow ${
              car.used ? "bg-amber-400 text-amber-950" : "bg-emerald-500 text-white"
            }`}
          >
            {car.used ? "Usado" : "0 km"}
          </span>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase">{car.brand}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{car.modelName}</h1>
          <p className="mt-4 text-4xl font-bold text-slate-900">{formatPrice(car.price)}</p>

          {!car.active && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Este auto esta dado de baja.</p>
          )}

          {car.description && <p className="mt-5 leading-relaxed text-slate-600">{car.description}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
                  <span aria-hidden="true">{spec.icon}</span>
                  {spec.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-slate-900">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <Link
            to="/"
            className="mt-6 inline-flex w-fit items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
          >
            ← Volver al catalogo
          </Link>
        </div>
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Tambien te puede interesar</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <CarCard key={other._id} car={other} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
