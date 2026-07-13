export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative bg-white rounded-xl2 shadow-xl w-full ${widths[size]} animate-[fadeIn_.15s_ease-out]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-50">
          <h3 className="font-display font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-ink text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-navy-50 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = "Xác nhận", message, confirmLabel = "Xác nhận", danger = false }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${danger ? "bg-coral-500 hover:bg-coral-600" : "bg-navy-800 hover:bg-navy-700"}`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  );
}

export function DeleteDialog(props) {
  return <ConfirmDialog {...props} danger title={props.title || "Xóa mục này?"} confirmLabel="Xóa" />;
}

export function SuccessDialog({ open, onClose, title = "Thành công", message, actionLabel = "Đóng" }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <button onClick={onClose} className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700">
        {actionLabel}
      </button>
    }>
      <div className="flex flex-col items-center text-center gap-2 py-2">
        <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-2xl">✓</div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </Modal>
  );
}
