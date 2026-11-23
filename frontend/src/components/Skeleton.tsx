// Placeholders animados mientras cargan los datos.
export const CarCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="h-44 animate-pulse bg-slate-200" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
    </div>
  </div>
);
