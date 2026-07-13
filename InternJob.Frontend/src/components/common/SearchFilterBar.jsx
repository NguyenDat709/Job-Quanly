export function SearchBar({ value, onChange, placeholder = "Tìm kiếm..." }) {
  return (
    <div className="relative flex-1 min-w-[220px]">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-navy-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400"
      />
    </div>
  );
}

export function FilterSelect({ value, onChange, options, placeholder = "Tất cả" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3.5 py-2.5 rounded-lg border border-navy-100 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400/50 min-w-[140px]"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function FilterBar({ children }) {
  return <div className="flex flex-wrap gap-3 mb-5">{children}</div>;
}
