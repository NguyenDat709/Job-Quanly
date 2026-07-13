export const NAV_BY_ROLE = {
  candidate: [
    { to: "/candidate/dashboard", label: "Tổng quan", icon: "🏠" },
    { to: "/candidate/jobs", label: "Tìm việc làm", icon: "🔎" },
    { to: "/candidate/applications", label: "Hồ sơ ứng tuyển", icon: "📄" },
    { to: "/candidate/ai-history", label: "Lịch sử AI", icon: "🤖" },
    { to: "/candidate/profile", label: "Hồ sơ cá nhân", icon: "👤" },
  ],
  employer: [
    { to: "/employer/dashboard", label: "Tổng quan", icon: "🏠" },
    { to: "/employer/jobs", label: "Tin tuyển dụng", icon: "📋" },
    { to: "/employer/candidates", label: "Ứng viên", icon: "🧑‍💼" },
    { to: "/employer/company", label: "Hồ sơ công ty", icon: "🏢" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Tổng quan", icon: "🏠" },
    { to: "/admin/users", label: "Người dùng", icon: "👥" },
    { to: "/admin/jobs", label: "Tin tuyển dụng", icon: "📋" },
    { to: "/admin/categories", label: "Ngành nghề", icon: "🗂️" },
    { to: "/admin/reports", label: "Báo cáo thống kê", icon: "📊" },
  ],
};

export const ROLE_LABEL = { candidate: "Ứng viên", employer: "Nhà tuyển dụng", admin: "Quản trị viên" };
