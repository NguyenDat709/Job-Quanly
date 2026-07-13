// Central place that maps a status string -> label + color.
// Business rule: "Trạng thái hồ sơ" and "Trạng thái tin tuyển dụng" each need
// a distinct badge color, defined once here so it stays consistent app-wide.
const STATUS_MAP = {
  reviewing: { label: "Đang xem xét", classes: "bg-navy-100 text-navy-700" },
  viewed: { label: "Đã xem", classes: "bg-teal-100 text-teal-700" },
  interview: { label: "Phỏng vấn", classes: "bg-amber-100 text-amber-700" },
  hired: { label: "Được nhận", classes: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Từ chối", classes: "bg-red-100 text-red-700" },

  open: { label: "Đang tuyển", classes: "bg-teal-100 text-teal-700" },
  closed: { label: "Đã đóng", classes: "bg-gray-200 text-gray-600" },
  expired: { label: "Hết hạn", classes: "bg-red-100 text-red-600" },

  candidate: { label: "Ứng viên", classes: "bg-navy-100 text-navy-700" },
  employer: { label: "Nhà tuyển dụng", classes: "bg-coral-100 text-coral-600" },
  admin: { label: "Quản trị viên", classes: "bg-ink text-white" },
};

export default function Badge({ status, children }) {
  const meta = STATUS_MAP[status] || { label: children || status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${meta.classes}`}>
      {meta.label}
    </span>
  );
}
