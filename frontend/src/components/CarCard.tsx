// Presentacional: recibe un auto por props, no sabe nada de axios ni de estado.
import { Link } from "react-router";
import type { Car } from "../types/car";
import { formatKm, formatPrice } from "../lib/format";
import { fuelLabels, transmissionLabels } from "../lib/car-labels";
import { CarVisual } from "./CarVisual";
import { Icon } from "./Icon";

interface CarCardProps {
  car: Car;
  index?: number;
}

export const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const specs = [
    { icon: "calendar" as const, value: String(car.year) },
    { icon: "gauge" as const, value: formatKm(car.mileage) },
    { icon: "cog" as const, value: transmissionLabels[car.transmission] ?? car.transmission },
    { icon: "fuel" as const, value: fuelLabels[car.fuel] ?? car.fuel },
  ];

  return (
    <Link
      to={`/cars/${car._id}`}
      style={{ animationDelay: `${index * 80}ms` }}
      className="group animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-500 hover:border-zinc-300 hover:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)] focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <CarVisual
          brand={car.brand}
          modelName={car.modelName}
          imageUrl={car.imageUrl}
          className="transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur ${
            car.used ? "bg-white/90 text-zinc-900" : "bg-zinc-950/85 text-white"
          }`}
        >
          {car.used ? "Usado" : "0 km"}
        </span>
      </div>

      <article className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.25em] text-zinc-500 uppercase">{car.brand}</p>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-950">{car.modelName}</h3>
            {car.engine && (
              <p className="mt-0.5 text-sm text-zinc-500">
                {car.engine}
                {car.horsepower > 0 && ` · ${car.horsepower} CV`}
              </p>
            )}
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-zinc-600">
          {specs.map((spec) => (
            <li key={spec.icon} className="flex items-center gap-2">
              <Icon name={spec.icon} size={15} strokeWidth={1.5} className="text-zinc-400" />
              {spec.value}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div className="border-t border-zinc-200 pt-4">
            <p className="text-[11px] tracking-[0.2em] text-zinc-400 uppercase">Precio</p>
            <p className="mt-0.5 text-xl font-semibold tracking-tight text-zinc-950 tabular-nums">{formatPrice(car.price)}</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
            <Icon name="arrowRight" size={16} />
          </span>
        </div>
      </article>
    </Link>
  );
};
