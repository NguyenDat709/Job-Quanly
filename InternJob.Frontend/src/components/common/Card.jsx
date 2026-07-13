export default function Card({ children, className = "", title, action }) {
  return (
    <div className={`bg-white rounded-xl2 shadow-card border border-navy-50 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5">
          {title && <h3 className="font-display font-bold text-ink text-base">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, icon, accent = "navy" }) {
  const accentClasses = {
    navy: "bg-navy-50 text-navy-700",
    teal: "bg-teal-50 text-teal-700",
    coral: "bg-coral-50 text-coral-600",
  };
  return (
    <div className="bg-white rounded-xl2 shadow-card border border-navy-50 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg ${accentClasses[accent]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold font-mono-num text-ink leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
