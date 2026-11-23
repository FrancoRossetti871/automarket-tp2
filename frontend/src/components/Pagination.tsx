interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const goTo = (target: number) => {
    onChange(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 text-sm" aria-label="Paginacion">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:bg-slate-100 disabled:opacity-40"
      >
        ← Anterior
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => goTo(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-9 min-w-9 rounded-lg px-2 font-medium ${
            p === page ? "bg-brand-600 text-white shadow" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 hover:bg-slate-100 disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  );
};
