export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 rounded-lg border border-navy-100 text-sm disabled:opacity-30 hover:bg-navy-50"
      >‹</button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold ${p === page ? "bg-navy-800 text-white" : "border border-navy-100 hover:bg-navy-50"}`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 rounded-lg border border-navy-100 text-sm disabled:opacity-30 hover:bg-navy-50"
      >›</button>
    </div>
  );
}

// simple hook-like helper used by list pages
export function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  return { pageItems: items.slice(start, start + pageSize), totalPages };
}
