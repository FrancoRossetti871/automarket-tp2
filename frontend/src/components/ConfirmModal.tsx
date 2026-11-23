// Ventana modal de confirmacion previa a eliminar. Ofrece baja logica, baja fisica o cancelar.
import type { Car } from "../types/car";

interface ConfirmModalProps {
  car: Car;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (hard: boolean) => void;
}

export const ConfirmModal = ({ car, busy, onCancel, onConfirm }: ConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl" aria-hidden="true">
          🗑️
        </div>
        <h3 id="confirm-title" className="text-lg font-semibold text-slate-900">
          ¿Eliminar {car.brand} {car.modelName}?
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          <strong>Dar de baja</strong> lo oculta del catalogo pero queda en la base (se puede reactivar).{" "}
          <strong>Eliminar definitivamente</strong> lo borra de la base y no se puede deshacer.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
          {car.active && (
            <button
              type="button"
              onClick={() => onConfirm(false)}
              disabled={busy}
              className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
            >
              Dar de baja
            </button>
          )}
          <button
            type="button"
            onClick={() => onConfirm(true)}
            disabled={busy}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};
