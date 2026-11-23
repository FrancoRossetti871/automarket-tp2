// Formulario de alta / modificacion con React Hook Form + Zod.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { carSchema, emptyCar, toCarFormValues, type CarFormValues } from "../../schemas/car.schema";
import type { Car } from "../../types/car";
import { CarVisual } from "../CarVisual";

interface CarFormProps {
  car: Car | null;
  onSave: (values: CarFormValues) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal focus:border-brand-600 focus:outline-none aria-invalid:border-red-500";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

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
  const [brand, modelName, imageUrl, price, used] = watch(["brand", "modelName", "imageUrl", "price", "used"]);

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
      className={`rounded-2xl border bg-white p-6 shadow-sm ${car ? "border-brand-600 ring-2 ring-brand-50" : "border-slate-200"}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          {car ? `✏️ Editando ${car.brand} ${car.modelName}` : "➕ Nuevo auto"}
        </h3>
        {car && (
          <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-900">
            Cancelar edicion
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Marca
              <input type="text" placeholder="Ej: Toyota" aria-invalid={!!errors.brand} {...register("brand")} className={inputClass} />
              {fieldError("brand")}
            </label>
            <label className={labelClass}>
              Modelo
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
              <input
                type="number"
                step="1000"
                aria-invalid={!!errors.price}
                {...register("price", { valueAsNumber: true })}
                className={inputClass}
              />
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

          <label className={labelClass}>
            URL de la imagen <span className="font-normal text-slate-400">(opcional)</span>
            <input type="text" placeholder="https://... o /cars/foto.jpg" aria-invalid={!!errors.imageUrl} {...register("imageUrl")} className={inputClass} />
            {fieldError("imageUrl")}
          </label>

          <label className={labelClass}>
            Descripcion
            <textarea rows={3} placeholder="Estado, equipamiento, detalles..." aria-invalid={!!errors.description} {...register("description")} className={inputClass} />
            {fieldError("description")}
          </label>

          <div className="flex flex-wrap gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 has-checked:border-brand-600 has-checked:bg-brand-50">
              <input type="checkbox" {...register("used")} />
              Usado
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 has-checked:border-brand-600 has-checked:bg-brand-50">
              <input type="checkbox" {...register("active")} />
              Activo (visible en el catalogo)
            </label>
          </div>
        </div>

        {/* Vista previa */}
        <aside className="hidden lg:block">
          <p className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Vista previa</p>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative h-32">
              <CarVisual brand={brand || "Marca"} modelName={modelName || "Modelo"} imageUrl={imageUrl || undefined} />
              <span
                className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  used ? "bg-amber-400 text-amber-950" : "bg-emerald-500 text-white"
                }`}
              >
                {used ? "Usado" : "0 km"}
              </span>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-brand-600 uppercase">{brand || "Marca"}</p>
              <p className="font-semibold text-slate-900">{modelName || "Modelo"}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatPrice(Number.isFinite(price) ? price : 0)}</p>
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
          className="rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : car ? "Guardar cambios" : "Crear auto"}
        </button>
        {car && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
