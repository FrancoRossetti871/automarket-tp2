import { Icon } from "./Icon";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950 disabled:opacity-30 disabled:hover:border-zinc-300";

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 text-sm" aria-label="Paginacion">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Pagina anterior" className={arrowClass}>
        <Icon name="arrowLeft" size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-10 min-w-10 rounded-full px-3 font-medium tabular-nums transition ${
            p === page ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-950"
          }`}
        >
          {p}
        </button>
      ))}
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Pagina siguiente" className={arrowClass}>
        <Icon name="arrowRight" size={16} />
      </button>
    </nav>
  );
};
