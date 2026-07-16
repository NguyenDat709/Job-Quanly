import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "../components/common/UserMenu";
import Footer from "../components/common/Footer";

const HOME_BY_ROLE = { candidate: "/candidate/dashboard", employer: "/employer/dashboard", admin: "/admin/dashboard" };

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="bg-white border-b border-navy-50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-extrabold text-xl text-navy-800">
            Intern<span className="text-teal-500">Job</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/jobs" className="hover:text-navy-800">Việc làm</Link>
            <Link to="/jobs?category=c1" className="hover:text-navy-800">Ngành nghề</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => navigate(HOME_BY_ROLE[user.role])} className="text-sm font-semibold text-navy-800 hover:underline hidden sm:block">
                  Vào Dashboard
                </button>
                <UserMenu />
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-navy-800 px-3 py-2">Đăng nhập</Link>
                <Link to="/register" className="text-sm font-semibold text-white bg-navy-800 hover:bg-navy-700 px-4 py-2 rounded-lg">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
