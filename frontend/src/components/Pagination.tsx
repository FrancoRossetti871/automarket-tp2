interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-3 text-sm" aria-label="Paginacion">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-100 disabled:opacity-40"
      >
        ← Anterior
      </button>
      <span className="text-slate-600">
        Pagina {page} de {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-100 disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  );
};
