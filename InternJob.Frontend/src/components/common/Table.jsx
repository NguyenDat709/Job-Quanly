import { EmptyState } from "./States";

// columns: [{ key, header, render?(row) }]
export default function Table({ columns, rows, emptyLabel = "Chưa có dữ liệu" }) {
  if (!rows.length) return <EmptyState title={emptyLabel} />;
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-100 text-left text-gray-500">
            {columns.map((c) => (
              <th key={c.key} className="px-5 py-3 font-semibold whitespace-nowrap">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className="border-b border-navy-50 hover:bg-navy-50/40 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-5 py-3.5 align-middle">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
