// Formulario de alta / modificacion con React Hook Form + Zod.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "../../lib/api";
import { carSchema, emptyCar, toCarFormValues, type CarFormValues } from "../../schemas/car.schema";
import type { Car } from "../../types/car";

interface CarFormProps {
  car: Car | null;
  onSave: (values: CarFormValues) => Promise<void>;
  onCancel: () => void;
}

const inputClass = "rounded border border-slate-300 px-3 py-2 aria-invalid:border-red-500";

export const CarForm = ({ car, onSave, onCancel }: CarFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(carSchema),
    values: car ? toCarFormValues(car) : emptyCar,
  });

  const onSubmit = async (values: CarFormValues) => {
    try {
      await onSave(values);
      reset(emptyCar);
    } catch (err) {
      setError("root.server", { message: getErrorMessage(err) });
    }
  };

  const fieldError = (name: keyof CarFormValues) =>
    errors[name] && <span className="text-xs text-red-600">{errors[name]?.message}</span>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-900">
        {car ? `Editando ${car.brand} ${car.modelName}` : "Nuevo auto"}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Marca
          <input type="text" aria-invalid={!!errors.brand} {...register("brand")} className={inputClass} />
          {fieldError("brand")}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Modelo
          <input type="text" aria-invalid={!!errors.modelName} {...register("modelName")} className={inputClass} />
          {fieldError("modelName")}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Año
          <input
            type="number"
            aria-invalid={!!errors.year}
            {...register("year", { valueAsNumber: true })}
            className={inputClass}
          />
          {fieldError("year")}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
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
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Kilometraje
          <input
            type="number"
            aria-invalid={!!errors.mileage}
            {...register("mileage", { valueAsNumber: true })}
            className={inputClass}
          />
          {fieldError("mileage")}
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          Fecha de ingreso
          <input type="date" aria-invalid={!!errors.entryDate} {...register("entryDate")} className={inputClass} />
          {fieldError("entryDate")}
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-700">
        Descripcion
        <textarea
          rows={2}
          aria-invalid={!!errors.description}
          {...register("description")}
          className={inputClass}
        />
        {fieldError("description")}
      </label>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register("used")} />
          Usado
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register("active")} />
          Activo (visible en el catalogo)
        </label>
      </div>

      {errors.root?.server && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.server.message}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : car ? "Guardar cambios" : "Crear"}
        </button>
        {car && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            Cancelar edicion
          </button>
        )}
      </div>
    </form>
  );
};
