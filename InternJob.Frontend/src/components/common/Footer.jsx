export default function Footer() {
  return (
    <footer className="bg-navy-800 text-navy-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-display font-extrabold text-white text-lg">Việc<span className="text-teal-400">Ngay</span></p>
          <p className="text-sm text-navy-300 mt-2">Nền tảng kết nối ứng viên và nhà tuyển dụng, hỗ trợ bởi AI.</p>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-2">Dành cho ứng viên</p>
          <ul className="text-sm text-navy-300 space-y-1.5">
            <li>Tìm việc làm</li>
            <li>Tạo CV</li>
            <li>Đánh giá CV bằng AI</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-2">Dành cho nhà tuyển dụng</p>
          <ul className="text-sm text-navy-300 space-y-1.5">
            <li>Đăng tin tuyển dụng</li>
            <li>Quản lý ứng viên</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-700 text-center text-xs text-navy-400 py-4">
        © {new Date().getFullYear()} ViecNgay. Dữ liệu demo — chưa kết nối backend thật.
      </div>
    </footer>
  );
}
