import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const HOME_BY_ROLE = { candidate: "/candidate/dashboard", employer: "/employer/dashboard", admin: "/admin/dashboard" };

const DEMO_ACCOUNTS = [
  { role: "Ứng viên", email: "candidate@demo.vn" },
  { role: "Nhà tuyển dụng", email: "employer@demo.vn" },
  { role: "Admin", email: "admin@demo.vn" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const HOME_BY_ROLE = { 
    candidate: "/candidate/dashboard", 
    employer: "/employer/dashboard", 
    admin: "/admin/dashboard" 
  };
  async function handleSubmit(e) {
      e.preventDefault();
      setError(""); setLoading(true);
      try {
        const user = await login(email, password);
        toast.success(`Chào mừng trở lại, ${user.fullName}!`);
        
        // CHỈNH SỬA Ở ĐÂY:
        // Chuyển role từ API về chữ thường trước khi so sánh với key trong object
        const roleKey = user.role.toLowerCase(); 
        navigate(location.state?.from || HOME_BY_ROLE[roleKey]);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Đăng nhập</h1>
      <p className="text-sm text-gray-500 mb-6">Truy cập tài khoản của bạn</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-card border border-navy-50 p-6 space-y-4">
        {error && <p className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3 py-2">{error}</p>}
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Mật khẩu</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
        </div>
        <button disabled={loading} className="w-full py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm disabled:opacity-60">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-5 bg-teal-50 border border-teal-100 rounded-xl2 p-4 text-xs text-navy-700">
        <p className="font-semibold mb-1.5">Tài khoản demo (mật khẩu: 123456)</p>
        {DEMO_ACCOUNTS.map((a) => (
          <button key={a.email} type="button" onClick={() => { setEmail(a.email); setPassword("123456"); }} className="block hover:underline">
            {a.role}: {a.email}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 text-center mt-5">
        Chưa có tài khoản? <Link to="/register" className="text-teal-600 font-semibold hover:underline">Đăng ký ngay</Link>
      </p>
    </div>
  );
}
