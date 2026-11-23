// Ruta privada por rol "/admin": ABM de autos.
import { useState } from "react";
import { getErrorMessage } from "../lib/api";
import { formatPrice } from "../lib/format";
import type { CarFormValues } from "../schemas/car.schema";
import { useCreateCarMutation, useDeleteCarMutation, useGetCarsQuery, useUpdateCarMutation } from "../store/api";
import type { Car } from "../types/car";
import { CarForm } from "../components/admin/CarForm";
import { ConfirmModal } from "../components/ConfirmModal";
import { Pagination } from "../components/Pagination";

export const Admin = () => {
  const [page, setPage] = useState(1);
  // El admin ve tambien los dados de baja (el backend solo lo permite si la sesion es admin).
  const { data, error: loadError } = useGetCarsQuery({ page, limit: 10, includeInactive: "true" });
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar, { error: deleteError, isLoading: deleting }] = useDeleteCarMutation();
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Estado de UI de esta pantalla: no es global, se queda en useState.
  const [editing, setEditing] = useState<Car | null>(null);
  const [toDelete, setToDelete] = useState<Car | null>(null);

  // Cada mutation invalida el tag "Cars" y RTK Query vuelve a pedir el listado (admin y catalogo publico).
  // unwrap() lanza el error para que lo muestre el form.
  const handleSave = async (values: CarFormValues) => {
    if (editing) {
      await updateCar({ id: editing._id, values }).unwrap();
      setEditing(null);
    } else {
      await createCar(values).unwrap();
    }
  };

  const handleConfirmDelete = async (hard: boolean) => {
    if (!toDelete) return;
    const result = await deleteCar({ id: toDelete._id, hard });
    if (!result.error && editing?._id === toDelete._id) setEditing(null);
    setToDelete(null);
  };

  const handleRestore = async (car: Car) => {
    setRestoreError(null);
    try {
      await updateCar({ id: car._id, values: { active: true } }).unwrap();
    } catch (err) {
      setRestoreError(getErrorMessage(err));
    }
  };

  const cars = data?.data ?? [];
  const error = loadError ?? deleteError ?? restoreError;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-slate-900">Panel de administracion</h2>

      <CarForm car={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
        {cars.map((car) => (
          <li key={car._id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className={`font-medium ${car.active ? "text-slate-900" : "text-slate-400 line-through"}`}>
                {car.brand} {car.modelName} ({car.year})
              </p>
              <p className="text-sm text-slate-500">
                {formatPrice(car.price)} · {car.used ? "Usado" : "0 km"} ·{" "}
                {car.active ? (
                  <span className="text-green-600">Activo</span>
                ) : (
                  <span className="text-amber-600">Dado de baja</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {!car.active && (
                <button
                  type="button"
                  onClick={() => handleRestore(car)}
                  className="rounded border border-green-300 px-3 py-1 text-sm text-green-700 hover:bg-green-50"
                >
                  Reactivar
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditing(car);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => setToDelete(car)}
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
        {cars.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">Todavia no hay autos cargados.</li>}
      </ul>

      {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />}

      {toDelete && (
        <ConfirmModal car={toDelete} busy={deleting} onCancel={() => setToDelete(null)} onConfirm={handleConfirmDelete} />
      )}
    </section>
  );
};
