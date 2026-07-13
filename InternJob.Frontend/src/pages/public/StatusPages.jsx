import { Link } from "react-router-dom";

function StatusScreen({ code, title, description, emoji }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="font-mono-num text-teal-600 font-bold text-lg">{code}</p>
      <h1 className="font-display font-extrabold text-2xl text-ink mt-1">{title}</h1>
      <p className="text-gray-500 text-sm mt-2 max-w-sm">{description}</p>
      <Link to="/" className="mt-6 px-5 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold">
        Về trang chủ
      </Link>
    </div>
  );
}

export function NotFound() {
  return <StatusScreen code="404" emoji="🧭" title="Không tìm thấy trang" description="Trang bạn tìm không tồn tại hoặc đã bị di chuyển." />;
}

export function Forbidden() {
  return <StatusScreen code="403" emoji="🔒" title="Không có quyền truy cập" description="Tài khoản của bạn không có quyền xem trang này." />;
}

export function ServerError() {
  return <StatusScreen code="500" emoji="🛠️" title="Có lỗi hệ thống" description="Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau." />;
}
