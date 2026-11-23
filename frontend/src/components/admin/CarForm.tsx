// Formulario de alta / modificacion con React Hook Form + Zod.
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { bodyTypeLabels, fuelLabels, tractionLabels, transmissionLabels } from "../../lib/car-labels";
import { carSchema, emptyCar, toCarFormValues, type CarFormValues } from "../../schemas/car.schema";
import { BODY_TYPES, FUELS, TRACTIONS, TRANSMISSIONS, type Car } from "../../types/car";
import { CarVisual } from "../CarVisual";
import { Icon } from "../Icon";

interface CarFormProps {
  car: Car | null;
  onSave: (values: CarFormValues) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "rounded-xl border border-zinc-300 bg-white px-3 py-2 font-normal focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none aria-invalid:border-red-500";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-zinc-700";

const Fieldset = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="rounded-2xl border border-zinc-200 p-4">
    <legend className="px-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">{title}</legend>
    {children}
  </fieldset>
);

export const CarForm = ({ car, onSave, onCancel }: CarFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(carSchema),
    values: car ? toCarFormValues(car) : emptyCar,
  });

  // Vista previa en vivo de como se va a ver la tarjeta.
  const [brand, modelName, imageUrl, price, used, engine, horsepower] = watch([
    "brand",
    "modelName",
    "imageUrl",
    "price",
    "used",
    "engine",
    "horsepower",
  ]);

  const onSubmit = async (values: CarFormValues) => {
    try {
      await onSave(values);
      reset(emptyCar);
    } catch (err) {
      setError("root.server", { message: getErrorMessage(err) });
    }
  };

  const fieldError = (name: keyof CarFormValues) =>
    errors[name] && <span className="text-xs font-normal text-red-600">{errors[name]?.message}</span>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`rounded-2xl border bg-white p-6 shadow-sm ${car ? "border-brand-600 ring-2 ring-brand-100" : "border-zinc-200"}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Icon name={car ? "pencil" : "plus"} size={16} />
          </span>
          {car ? `Editando ${car.brand} ${car.modelName}` : "Nuevo auto"}
        </h3>
        {car && (
          <button type="button" onClick={onCancel} className="text-sm text-zinc-500 hover:text-zinc-900">
            Cancelar edicion
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="flex flex-col gap-5">
          <Fieldset title="Datos generales">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Marca
                <input type="text" placeholder="Ej: Toyota" aria-invalid={!!errors.brand} {...register("brand")} className={inputClass} />
                {fieldError("brand")}
              </label>
              <label className={labelClass}>
                Modelo / version
                <input type="text" placeholder="Ej: Corolla XEI" aria-invalid={!!errors.modelName} {...register("modelName")} className={inputClass} />
                {fieldError("modelName")}
              </label>
              <label className={labelClass}>
                Año
                <input type="number" aria-invalid={!!errors.year} {...register("year", { valueAsNumber: true })} className={inputClass} />
                {fieldError("year")}
              </label>
              <label className={labelClass}>
                Precio (ARS)
                <input type="number" step="1000" aria-invalid={!!errors.price} {...register("price", { valueAsNumber: true })} className={inputClass} />
                {fieldError("price")}
              </label>
              <label className={labelClass}>
                Kilometraje
                <input type="number" aria-invalid={!!errors.mileage} {...register("mileage", { valueAsNumber: true })} className={inputClass} />
                {fieldError("mileage")}
              </label>
              <label className={labelClass}>
                Fecha de ingreso
                <input type="date" aria-invalid={!!errors.entryDate} {...register("entryDate")} className={inputClass} />
                {fieldError("entryDate")}
              </label>
            </div>
          </Fieldset>

          <Fieldset title="Ficha tecnica">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={`${labelClass} sm:col-span-2`}>
                Motor
                <input type="text" placeholder="Ej: 2.0 16V Dual VVT-i" aria-invalid={!!errors.engine} {...register("engine")} className={inputClass} />
                {fieldError("engine")}
              </label>
              <label className={labelClass}>
                Potencia (CV)
                <input type="number" aria-invalid={!!errors.horsepower} {...register("horsepower", { valueAsNumber: true })} className={inputClass} />
                {fieldError("horsepower")}
              </label>
              <label className={labelClass}>
                Transmision
                <select {...register("transmission")} className={inputClass}>
                  {TRANSMISSIONS.map((value) => (
                    <option key={value} value={value}>
                      {transmissionLabels[value]}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Combustible
                <select {...register("fuel")} className={inputClass}>
                  {FUELS.map((value) => (
                    <option key={value} value={value}>
                      {fuelLabels[value]}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Traccion
                <select {...register("traction")} className={inputClass}>
                  {TRACTIONS.map((value) => (
                    <option key={value} value={value}>
                      {tractionLabels[value]}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Carroceria
                <select {...register("bodyType")} className={inputClass}>
                  {BODY_TYPES.map((value) => (
                    <option key={value} value={value}>
                      {bodyTypeLabels[value]}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Puertas
                <input type="number" aria-invalid={!!errors.doors} {...register("doors", { valueAsNumber: true })} className={inputClass} />
                {fieldError("doors")}
              </label>
              <label className={labelClass}>
                Color
                <input type="text" placeholder="Ej: Rojo" aria-invalid={!!errors.color} {...register("color")} className={inputClass} />
                {fieldError("color")}
              </label>
            </div>
          </Fieldset>

          <Fieldset title="Detalle y publicacion">
            <div className="flex flex-col gap-4">
              <label className={labelClass}>
                Equipamiento <span className="font-normal text-zinc-400">(uno por linea)</span>
                <textarea
                  rows={4}
                  placeholder={"Pantalla tactil de 8\"\nCamara de retroceso\n6 airbags"}
                  aria-invalid={!!errors.featuresText}
                  {...register("featuresText")}
                  className={inputClass}
                />
                {fieldError("featuresText")}
              </label>
              <label className={labelClass}>
                Descripcion
                <textarea rows={3} placeholder="Estado, historial, detalles..." aria-invalid={!!errors.description} {...register("description")} className={inputClass} />
                {fieldError("description")}
              </label>
              <label className={labelClass}>
                Imagen <span className="font-normal text-zinc-400">(opcional)</span>
                <input type="text" placeholder="https://... o /cars/foto.jpg" aria-invalid={!!errors.imageUrl} {...register("imageUrl")} className={inputClass} />
                {fieldError("imageUrl")}
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 has-checked:border-brand-600 has-checked:bg-brand-50">
                  <input type="checkbox" {...register("used")} />
                  Usado
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-700 has-checked:border-brand-600 has-checked:bg-brand-50">
                  <input type="checkbox" {...register("active")} />
                  Activo (visible en el catalogo)
                </label>
              </div>
            </div>
          </Fieldset>
        </div>

        {/* Vista previa */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Vista previa</p>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
              <div className="relative aspect-[16/10]">
                <CarVisual brand={brand || "Marca"} modelName={modelName || "Modelo"} imageUrl={imageUrl || undefined} />
                <span
                  className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    used ? "bg-white/95 text-zinc-800" : "bg-zinc-950 text-white"
                  }`}
                >
                  {used ? "Usado" : "0 km"}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase">{brand || "Marca"}</p>
                <p className="font-semibold text-zinc-900">{modelName || "Modelo"}</p>
                {(engine || horsepower > 0) && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {engine} {horsepower > 0 && `· ${horsepower} CV`}
                  </p>
                )}
                <p className="mt-2 text-lg font-bold text-zinc-900">{formatPrice(Number.isFinite(price) ? price : 0)}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {errors.root?.server && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {errors.root.server.message}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-zinc-950 px-5 py-2.5 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : car ? "Guardar cambios" : "Crear auto"}
        </button>
        {car && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-zinc-300 px-5 py-2.5 text-zinc-700 hover:bg-zinc-100">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
