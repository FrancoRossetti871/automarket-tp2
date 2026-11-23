// Presentacional: recibe un auto por props, no sabe nada de axios ni de estado.
import { Link } from "react-router";
import type { Car } from "../types/car";
import { formatKm, formatPrice } from "../lib/format";

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <Link
      to={`/cars/${car._id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
    >
      <article>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{car.year}</span>
          <span className={`text-xs font-medium ${car.used ? "text-amber-600" : "text-green-600"}`}>
            {car.used ? "Usado" : "0 km"}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {car.brand} {car.modelName}
        </h3>
        <p className="mt-1 text-xl font-bold text-slate-900">{formatPrice(car.price)}</p>
        <p className="mt-1 text-sm text-slate-500">{formatKm(car.mileage)}</p>
        <p className="mt-3 text-xs text-slate-400">Ver detalle →</p>
      </article>
    </Link>
  );
};
