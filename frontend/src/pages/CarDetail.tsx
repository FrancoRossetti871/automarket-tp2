// Ruta publica "/cars/:id". El id sale de la URL con useParams.
import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useParams } from "react-router";
import { getErrorMessage } from "../lib/api";
import { formatDate, formatKm, formatPrice } from "../lib/format";
import { useGetCarByIdQuery } from "../store/api";

export const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  // skipToken = no pedir nada si no hay id.
  const { data: car, isLoading, error } = useGetCarByIdQuery(id ?? skipToken);

  if (isLoading) {
    return <p className="text-slate-500">Cargando auto...</p>;
  }

  if (error || !car) {
    return (
      <section>
        <p className="text-red-600">No se pudo cargar el auto: {getErrorMessage(error)}</p>
        <Link to="/" className="mt-2 inline-block text-slate-600 underline">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link to="/" className="text-sm text-slate-500 underline">
        Volver al catalogo
      </Link>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
        {car.brand} {car.modelName}
      </h2>
      <p className="mt-1 text-2xl font-bold text-slate-900">{formatPrice(car.price)}</p>
      {car.description && <p className="mt-3 text-slate-600">{car.description}</p>}
      {!car.active && (
        <p className="mt-3 rounded bg-amber-50 p-2 text-sm text-amber-800">Este auto esta dado de baja.</p>
      )}
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:max-w-md">
        <dt className="text-slate-500">Año</dt>
        <dd className="text-slate-900">{car.year}</dd>
        <dt className="text-slate-500">Kilometraje</dt>
        <dd className="text-slate-900">{formatKm(car.mileage)}</dd>
        <dt className="text-slate-500">Condicion</dt>
        <dd className={car.used ? "text-amber-600" : "text-green-600"}>{car.used ? "Usado" : "0 km"}</dd>
        <dt className="text-slate-500">Fecha de ingreso</dt>
        <dd className="text-slate-900">{formatDate(car.entryDate)}</dd>
      </dl>
    </section>
  );
};
