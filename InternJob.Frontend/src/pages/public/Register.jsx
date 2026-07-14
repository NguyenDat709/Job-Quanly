import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const HOME_BY_ROLE = { candidate: "/candidate/dashboard", employer: "/employer/dashboard" };

export default function Register() {
  const [form, setForm] = useState({ role: "candidate", fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const payload = {
        ...form,
        role: form.role.charAt(0).toUpperCase() + form.role.slice(1) // Biến 'candidate' thành 'Candidate'
      };

      const user = await register(payload); // GỬI 'payload' ĐÃ ĐƯỢC ÉP KIỂU
      toast.success("Đăng ký thành công!");
      
      // Chú ý: Backend có thể trả về role viết hoa, nên cũng cần lowercase khi điều hướng
      navigate(HOME_BY_ROLE[user.role.toLowerCase()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Tạo tài khoản</h1>
      <p className="text-sm text-gray-500 mb-6">Miễn phí cho cả ứng viên và nhà tuyển dụng</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl2 shadow-card border border-navy-50 p-6 space-y-4">
        {error && <p className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          {[{ v: "candidate", l: "Ứng viên" }, { v: "employer", l: "Nhà tuyển dụng" }].map((r) => (
            <button type="button" key={r.v} onClick={() => set("role", r.v)}
              className={`py-2.5 rounded-lg text-sm font-semibold border ${form.role === r.v ? "bg-navy-800 text-white border-navy-800" : "border-navy-100 text-gray-600"}`}>
              {r.l}
            </button>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Họ và tên</label>
          <input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
            className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
            className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Số điện thoại</label>
          <input required value={form.phone} onChange={(e) => set("phone", e.target.value)}
            className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Mật khẩu</label>
          <input required type="password" minLength={6} value={form.password} onChange={(e) => set("password", e.target.value)}
            className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
        </div>
        <button disabled={loading} className="w-full py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm disabled:opacity-60">
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-5">
        Đã có tài khoản? <Link to="/login" className="text-teal-600 font-semibold hover:underline">Đăng nhập</Link>
      </p>
    </div>
  );
}
