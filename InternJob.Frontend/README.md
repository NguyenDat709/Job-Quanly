# ViecNgay — Nền tảng tuyển dụng (Frontend Demo)

Ứng dụng React (Vite) mô phỏng đầy đủ một hệ thống tuyển dụng kiểu TopCV/VietnamWorks,
dùng **Mock API chạy trên localStorage** — không cần backend thật để chạy thử.

## Chạy thử

```bash
npm install
npm run dev
```

Tài khoản demo (mật khẩu: `123456`):
- Ứng viên: `candidate@demo.vn`
- Nhà tuyển dụng: `employer@demo.vn`
- Admin: `admin@demo.vn`

## Cấu trúc thư mục

```
src/
  mockapi/          # "Backend" giả lập — thay bằng API thật ở đây khi có backend
    seed.js         # Dữ liệu mẫu
    storage.js      # Helper đọc/ghi localStorage như 1 bảng REST
    index.js        # Toàn bộ hàm API (login, getJobs, applyToJob, ...) — trang chỉ import từ đây

  context/
    AuthContext.jsx   # Người dùng hiện tại, login/logout/register
    ToastContext.jsx  # Thông báo toast toàn cục

  layouts/
    PublicLayout.jsx    # Header/Footer cho trang công khai (landing, login...)
    DashboardLayout.jsx # Sidebar + Header dùng chung cho candidate/employer/admin
    navConfig.js        # Danh sách menu sidebar theo từng vai trò

  routes/
    ProtectedRoute.jsx  # Chặn truy cập theo vai trò (candidate/employer/admin) -> 403

  components/
    common/    # Badge, Card, Table, Modal, Pagination, EmptyState, Skeleton...
    job/       # JobCard, JobBrowser (tìm kiếm+lọc+phân trang), JobDetail (dùng chung)

  pages/
    public/    # Landing, Login, Register, JobList/Detail công khai, 404/403/500
    candidate/ # Dashboard, tìm việc, ứng tuyển, upload CV, hồ sơ ứng tuyển, AI, profile
    employer/  # Dashboard, quản lý tin, form đăng tin, danh sách ứng viên, hồ sơ công ty
    admin/     # Dashboard, quản lý user/tin/ngành nghề, báo cáo thống kê
```

## Logic nghiệp vụ đã áp dụng

- Chỉ tài khoản **candidate** thấy nút "Ứng tuyển"; **employer** chỉ sửa/xóa được tin do
  chính mình đăng (lọc theo `employerId`); **admin** quản lý toàn hệ thống.
- Tin hết hạn (`deadline < hôm nay`) tự động hiển thị badge "Hết hạn", vô hiệu hóa nút ứng tuyển.
- Không cho ứng tuyển trùng cùng 1 CV cho cùng 1 job (kiểm tra ở `mockapi/index.js`).
- Chỉ nhận upload `.pdf` / `.docx`.
- Chưa có CV → bấm "Ứng tuyển" sẽ điều hướng sang màn hình Upload CV trước.
- Badge trạng thái hồ sơ có màu riêng: Đang xem xét / Đã xem / Phỏng vấn / Được nhận / Từ chối.

## Kết nối API thật

Toàn bộ trang chỉ gọi hàm trong `src/mockapi/index.js` (không đụng trực tiếp
localStorage). Khi có backend thật, chỉ cần viết lại các hàm trong file này bằng
`fetch`/`axios` gọi API thật — không cần sửa bất kỳ trang hay component nào khác.
