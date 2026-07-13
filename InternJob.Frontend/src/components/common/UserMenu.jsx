import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PROFILE_PATH = { candidate: "/candidate/profile", employer: "/employer/company", admin: "/admin/dashboard" };

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;
  const initials = user.fullName?.split(" ").slice(-1)[0]?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-navy-50">
        <div className="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center text-sm font-bold">{initials}</div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-ink leading-tight">{user.fullName}</p>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-navy-50 py-1.5 z-40">
          <Link to={PROFILE_PATH[user.role]} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-ink hover:bg-navy-50">Hồ sơ cá nhân</Link>
          {user.role === "candidate" && (
            <Link to="/candidate/change-password" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-ink hover:bg-navy-50">Đổi mật khẩu</Link>
          )}
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full text-left px-4 py-2 text-sm text-coral-600 hover:bg-coral-50"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
