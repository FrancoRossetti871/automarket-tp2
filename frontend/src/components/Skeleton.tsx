// Placeholders mientras cargan los datos.
export const CarCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
    <div className="aspect-[16/10] animate-pulse bg-zinc-200" />
    <div className="space-y-3 p-6">
      <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
      <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
      <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
      <div className="h-6 w-28 animate-pulse rounded bg-zinc-200" />
    </div>
  </div>
);
