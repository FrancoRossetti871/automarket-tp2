// Ruta privada por rol "/admin": ABM de autos.
import { useState } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../lib/api";
import { formatKm, formatPrice } from "../lib/format";
import { toCarPayload, type CarFormValues } from "../schemas/car.schema";
import { useCreateCarMutation, useDeleteCarMutation, useGetCarsQuery, useUpdateCarMutation } from "../store/api";
import type { Car } from "../types/car";
import { CarForm } from "../components/admin/CarForm";
import { CarVisual } from "../components/CarVisual";
import { Icon } from "../components/Icon";
import { ConfirmModal } from "../components/ConfirmModal";
import { Pagination } from "../components/Pagination";

export const Admin = () => {
  const [page, setPage] = useState(1);
  // El admin ve tambien los dados de baja (el backend solo lo permite si la sesion es admin).
  const { data, error: loadError, isLoading } = useGetCarsQuery({ page, limit: 8, includeInactive: "true" });
  // Contador de activos (sin includeInactive) para las tarjetas de resumen.
  const { data: activeData } = useGetCarsQuery({ limit: 1 });
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar, { error: deleteError, isLoading: deleting }] = useDeleteCarMutation();
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Estado de UI de esta pantalla: no es global, se queda en useState.
  const [editing, setEditing] = useState<Car | null>(null);
  const [toDelete, setToDelete] = useState<Car | null>(null);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3000);
  };

  // Cada mutation invalida el tag "Cars" y RTK Query vuelve a pedir el listado (admin y catalogo publico).
  // unwrap() lanza el error para que lo muestre el form.
  const handleSave = async (formValues: CarFormValues) => {
    const values = toCarPayload(formValues);
    if (editing) {
      await updateCar({ id: editing._id, values }).unwrap();
      setEditing(null);
      flash("Auto actualizado");
    } else {
      await createCar(values).unwrap();
      flash("Auto creado");
    }
  };

  const handleConfirmDelete = async (hard: boolean) => {
    if (!toDelete) return;
    const result = await deleteCar({ id: toDelete._id, hard });
    if (!result.error) {
      if (editing?._id === toDelete._id) setEditing(null);
      flash(hard ? "Auto eliminado definitivamente" : "Auto dado de baja");
    }
    setToDelete(null);
  };

  const handleRestore = async (car: Car) => {
    setRestoreError(null);
    try {
      await updateCar({ id: car._id, values: { active: true } }).unwrap();
      flash("Auto reactivado");
    } catch (err) {
      setRestoreError(getErrorMessage(err));
    }
  };

  const cars = data?.data ?? [];
  const total = data?.meta.total;
  const active = activeData?.meta.total;
  const error = loadError ?? deleteError ?? restoreError;

  const stats = [
    { label: "Total en la base", value: total, color: "text-zinc-900" },
    { label: "Activos en catalogo", value: active, color: "text-zinc-950" },
    {
      label: "Dados de baja",
      value: total !== undefined && active !== undefined ? total - active : undefined,
      color: "text-zinc-400",
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Panel de administracion</h1>
          <p className="text-zinc-500">Alta, modificacion y baja de los autos del catalogo.</p>
        </div>
        <Link to="/admin/usuarios" className="text-sm font-medium text-zinc-950 hover:underline">
          Gestionar usuarios →
        </Link>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <dt className="text-sm text-zinc-500">{stat.label}</dt>
            <dd className={`mt-1 text-3xl font-bold ${stat.color}`}>{stat.value ?? "—"}</dd>
          </div>
        ))}
      </dl>

      <CarForm car={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

      {notice && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white p-3 text-sm font-medium text-zinc-900">
          <Icon name="check" size={16} />
          {notice}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {getErrorMessage(error)}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs tracking-wide text-zinc-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Auto</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Km</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cars.map((car) => (
                <tr key={car._id} className={`hover:bg-zinc-50 ${editing?._id === car._id ? "bg-brand-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                        <CarVisual brand={car.brand} modelName={car.modelName} imageUrl={car.imageUrl} size="sm" />
                      </div>
                      <div>
                        <p className={`font-medium ${car.active ? "text-zinc-900" : "text-zinc-400 line-through"}`}>
                          {car.brand} {car.modelName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {car.year} · {car.used ? "Usado" : "0 km"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{formatPrice(car.price)}</td>
                  <td className="px-4 py-3 text-zinc-600">{formatKm(car.mileage)}</td>
                  <td className="px-4 py-3">
                    {car.active ? (
                      <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white">Activo</span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500">Dado de baja</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {!car.active && (
                        <button
                          type="button"
                          onClick={() => handleRestore(car)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-800 hover:border-zinc-950"
                        >
                          <Icon name="rotate" size={14} />
                          Reactivar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(car);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
                      >
                        <Icon name="pencil" size={14} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(car)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-red-700 hover:bg-red-50"
                      >
                        <Icon name="trash" size={14} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && cars.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    Todavia no hay autos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />}

      {toDelete && (
        <ConfirmModal car={toDelete} busy={deleting} onCancel={() => setToDelete(null)} onConfirm={handleConfirmDelete} />
      )}
    </section>
  );
};
