import { useState, useRef, useEffect } from "react";

// In a real backend this would come from a /notifications endpoint.
// For the mock, a small static set demonstrates the UI and unread badge.
const DEMO_NOTIFICATIONS = [
  { id: 1, text: "Hồ sơ của bạn cho vị trí Frontend Developer đã được xem.", time: "2 giờ trước", unread: true },
  { id: 2, text: "Bạn có lịch phỏng vấn cho vị trí UI/UX Designer.", time: "1 ngày trước", unread: true },
  { id: 3, text: "Tin tuyển dụng Kế toán tổng hợp sắp hết hạn.", time: "3 ngày trước", unread: false },
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(DEMO_NOTIFICATIONS);
  const ref = useRef(null);
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="relative w-10 h-10 rounded-full hover:bg-navy-50 flex items-center justify-center text-lg">
        🔔
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-navy-50 z-40 overflow-hidden">
          <div className="px-4 py-3 border-b border-navy-50 flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-ink">Thông báo</h4>
            <button onClick={() => setItems((it) => it.map((i) => ({ ...i, unread: false })))} className="text-xs text-teal-600 font-semibold hover:underline">
              Đánh dấu đã đọc
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-navy-50">
            {items.map((n) => (
              <div key={n.id} className={`px-4 py-3 text-sm ${n.unread ? "bg-teal-50/40" : ""}`}>
                <p className="text-ink">{n.text}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
