// Presentacional: recibe un auto por props, no sabe nada de axios ni de estado.
import { Link } from "react-router";
import type { Car } from "../types/car";
import { formatKm, formatPrice } from "../lib/format";
import { CarVisual } from "./CarVisual";

interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <Link
      to={`/cars/${car._id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
    >
      <article>
        <div className="relative h-44 overflow-hidden">
          <CarVisual
            brand={car.brand}
            modelName={car.modelName}
            imageUrl={car.imageUrl}
            className="transition duration-300 group-hover:scale-105"
          />
          <span
            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow ${
              car.used ? "bg-amber-400 text-amber-950" : "bg-emerald-500 text-white"
            }`}
          >
            {car.used ? "Usado" : "0 km"}
          </span>
          <span className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {car.year}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold tracking-wider text-brand-600 uppercase">{car.brand}</p>
          <h3 className="mt-0.5 text-lg font-semibold text-slate-900">{car.modelName}</h3>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="text-2xl font-bold text-slate-900">{formatPrice(car.price)}</p>
            <p className="text-sm text-slate-500">{formatKm(car.mileage)}</p>
          </div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-sm font-medium text-brand-600 group-hover:underline">
            Ver detalle →
          </p>
        </div>
      </article>
    </Link>
  );
};
