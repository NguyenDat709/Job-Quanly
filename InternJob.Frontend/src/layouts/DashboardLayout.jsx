import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "../components/common/UserMenu";
import NotificationCenter from "../components/common/NotificationCenter";
import { NAV_BY_ROLE, ROLE_LABEL } from "./navConfig";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = NAV_BY_ROLE[user.role];

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-navy-800 text-white flex flex-col transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Link to="/" className="flex items-center h-16 px-6 font-display font-extrabold text-lg border-b border-navy-700">
          Việc<span className="text-teal-400">Ngay</span>
        </Link>
        <div className="px-6 py-4 text-xs uppercase tracking-wide text-navy-300">{ROLE_LABEL[user.role]}</div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-teal-500 text-white" : "text-navy-200 hover:bg-navy-700 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-navy-700 text-xs text-navy-400">
          Dữ liệu mock — kết nối API thật khi sẵn sàng.
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-ink/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-navy-50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <button className="lg:hidden text-xl" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
