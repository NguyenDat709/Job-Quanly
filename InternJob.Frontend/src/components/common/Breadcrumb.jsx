import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  // items: [{ label, to }] — last item has no `to` (current page)
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {item.to ? (
            <Link to={item.to} className="hover:text-navy-700">{item.label}</Link>
          ) : (
            <span className="text-ink font-medium">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-gray-300">/</span>}
        </span>
      ))}
    </nav>
  );
}
