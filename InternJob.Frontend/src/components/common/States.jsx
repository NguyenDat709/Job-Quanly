export function EmptyState({ title = "Chưa có dữ liệu", description, action, icon = "📭" }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-bold text-ink text-lg">{title}</h3>
      {description && <p className="text-gray-500 text-sm mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Đã có lỗi xảy ra", description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="font-display font-bold text-ink text-lg">{title}</h3>
      {description && <p className="text-gray-500 text-sm mt-1 max-w-sm">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-5 px-4 py-2 rounded-lg bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700">
          Thử lại
        </button>
      )}
    </div>
  );
}

export function SkeletonRow({ className = "h-4 w-full" }) {
  return <div className={`animate-pulse bg-navy-100/70 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl2 shadow-card border border-navy-50 p-5 space-y-3">
      <SkeletonRow className="h-5 w-2/3" />
      <SkeletonRow className="h-3 w-1/2" />
      <SkeletonRow className="h-3 w-full" />
      <SkeletonRow className="h-3 w-4/5" />
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
