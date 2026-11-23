// Ruta publica "/cars/:id". El id sale de la URL con useParams.
import { skipToken } from "@reduxjs/toolkit/query";
import { Link, useParams } from "react-router";
import { getErrorMessage } from "../lib/api";
import { formatDate, formatKm, formatPrice } from "../lib/format";
import { bodyTypeLabels, fuelLabels, tractionLabels, transmissionLabels } from "../lib/car-labels";
import { useGetCarByIdQuery, useGetCarsQuery } from "../store/api";
import { CarVisual } from "../components/CarVisual";
import { CarCard } from "../components/CarCard";
import { Icon, type IconName } from "../components/Icon";

interface Spec {
  icon: IconName;
  label: string;
  value: string;
}

export const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  // skipToken = no pedir nada si no hay id.
  const { data: car, isLoading, error } = useGetCarByIdQuery(id ?? skipToken);
  // "Tambien te puede interesar": otros autos de la misma marca.
  const { data: related } = useGetCarsQuery(car ? { search: car.brand, limit: 4 } : skipToken);
  const others = related?.data.filter((c) => c._id !== car?._id).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="grid animate-pulse gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="aspect-[4/3] rounded-3xl bg-zinc-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-zinc-200" />
          <div className="h-9 w-64 rounded bg-zinc-200" />
          <div className="h-10 w-48 rounded bg-zinc-200" />
          <div className="h-40 rounded-2xl bg-zinc-200" />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <section className="flex flex-col items-center rounded-3xl border border-zinc-200 bg-white p-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <Icon name="search" size={24} />
        </span>
        <p className="mt-5 font-medium text-zinc-950">No encontramos este auto</p>
        <p className="mt-1 text-sm text-zinc-500">{getErrorMessage(error)}</p>
        <Link to="/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800">
          <Icon name="arrowLeft" size={16} />
          Volver al catalogo
        </Link>
      </section>
    );
  }

  // Datos destacados (franja oscura debajo del precio)
  const highlights: Spec[] = [
    { icon: "zap", label: "Potencia", value: car.horsepower > 0 ? `${car.horsepower} CV` : "—" },
    { icon: "cog", label: "Transmision", value: transmissionLabels[car.transmission] ?? car.transmission },
    { icon: "fuel", label: "Combustible", value: fuelLabels[car.fuel] ?? car.fuel },
    { icon: "gauge", label: "Kilometraje", value: formatKm(car.mileage) },
  ];

  // Ficha tecnica completa, agrupada
  const groups: { title: string; specs: Spec[] }[] = [
    {
      title: "Motor y transmision",
      specs: [
        { icon: "engine", label: "Motor", value: car.engine || "—" },
        { icon: "zap", label: "Potencia", value: car.horsepower > 0 ? `${car.horsepower} CV` : "—" },
        { icon: "cog", label: "Transmision", value: transmissionLabels[car.transmission] ?? car.transmission },
        { icon: "fuel", label: "Combustible", value: fuelLabels[car.fuel] ?? car.fuel },
        { icon: "layers", label: "Traccion", value: tractionLabels[car.traction] ?? car.traction },
      ],
    },
    {
      title: "Carroceria",
      specs: [
        { icon: "car", label: "Tipo", value: bodyTypeLabels[car.bodyType] ?? car.bodyType },
        { icon: "door", label: "Puertas", value: String(car.doors) },
        { icon: "palette", label: "Color", value: car.color || "—" },
      ],
    },
    {
      title: "Historial",
      specs: [
        { icon: "calendar", label: "Año", value: String(car.year) },
        { icon: "gauge", label: "Kilometraje", value: formatKm(car.mileage) },
        { icon: car.used ? "tag" : "sparkles", label: "Condicion", value: car.used ? "Usado" : "0 km" },
        { icon: "clock", label: "Ingreso", value: formatDate(car.entryDate) },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-14">
      <nav className="flex items-center gap-2 text-xs tracking-[0.15em] text-zinc-500 uppercase" aria-label="Ruta de navegacion">
        <Link to="/" className="transition hover:text-zinc-950">
          Catalogo
        </Link>
        <span aria-hidden="true">/</span>
        <span>{car.brand}</span>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-950">{car.modelName}</span>
      </nav>

      <section className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div className="animate-fade-in relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-100 shadow-[0_32px_64px_-32px_rgb(0_0_0/0.45)]">
          <CarVisual brand={car.brand} modelName={car.modelName} imageUrl={car.imageUrl} size="lg" />
          <span
            className={`absolute top-4 left-4 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase backdrop-blur ${
              car.used ? "bg-white/90 text-zinc-900" : "bg-zinc-950/85 text-white"
            }`}
          >
            {car.used ? "Usado" : "0 km"}
          </span>
        </div>

        <div className="animate-fade-up flex flex-col">
          <p className="text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">{car.brand}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">{car.modelName}</h1>
          {car.engine && (
            <p className="mt-2 text-zinc-500">
              {car.engine} · {bodyTypeLabels[car.bodyType] ?? car.bodyType} · {car.year}
            </p>
          )}

          {!car.active && (
            <p className="mt-5 rounded-2xl border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-700">
              Este auto esta dado de baja y no se muestra en el catalogo.
            </p>
          )}

          <div className="mt-8 overflow-hidden rounded-2xl bg-zinc-950 text-white">
            <div className="p-6">
              <p className="text-[11px] tracking-[0.25em] text-zinc-500 uppercase">Precio</p>
              <p className="text-silver mt-1 text-4xl font-semibold tracking-tight tabular-nums">{formatPrice(car.price)}</p>
              <p className="mt-1 text-xs text-zinc-500">Precio de contado en pesos argentinos.</p>
            </div>
            <dl className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10">
              {highlights.map((spec) => (
                <div key={spec.label} className="flex items-center gap-3 bg-zinc-950 px-6 py-4">
                  <Icon name={spec.icon} size={18} strokeWidth={1.5} className="text-zinc-500" />
                  <div>
                    <dt className="text-[11px] tracking-[0.15em] text-zinc-500 uppercase">{spec.label}</dt>
                    <dd className="font-medium text-white">{spec.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {car.description && <p className="mt-8 leading-relaxed text-zinc-600">{car.description}</p>}
        </div>
      </section>

      {/* Ficha tecnica + equipamiento */}
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10">
          <p className="text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">Especificaciones</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">Ficha tecnica</h2>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {groups.map((group, gi) => (
              <div key={group.title} className={gi === 0 ? "sm:col-span-2" : ""}>
                <h3 className="text-[11px] font-semibold tracking-[0.25em] text-zinc-400 uppercase">{group.title}</h3>
                <dl className={`mt-3 ${gi === 0 ? "sm:grid sm:grid-cols-2 sm:gap-x-10" : ""}`}>
                  {group.specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
                      <dt className="flex items-center gap-2.5 text-sm text-zinc-500">
                        <Icon name={spec.icon} size={16} strokeWidth={1.5} className="text-zinc-400" />
                        {spec.label}
                      </dt>
                      <dd className="text-right text-sm font-medium text-zinc-950">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-zinc-950 p-6 text-white sm:p-10">
          <p className="text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">Incluye</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Equipamiento</h2>
          {car.features.length > 0 ? (
            <ul className="mt-8 space-y-4">
              {car.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/25 text-zinc-200">
                    <Icon name="check" size={11} strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-sm text-zinc-500">Sin equipamiento cargado.</p>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section>
          <p className="text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">Seguir explorando</p>
          <h2 className="mt-2 mb-6 text-2xl font-semibold tracking-tight text-zinc-950">Tambien te puede interesar</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => (
              <CarCard key={other._id} car={other} index={i} />
            ))}
          </div>
        </section>
      )}

      <Link
        to="/"
        className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-950"
      >
        <Icon name="arrowLeft" size={16} />
        Volver al catalogo
      </Link>
    </div>
  );
};
