import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";

export default function ChangePassword() {
  const { user } = useAuth();
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirm) { setError("Mật khẩu xác nhận không khớp."); return; }
    if (newPassword.length < 6) { setError("Mật khẩu mới phải có ít nhất 6 ký tự."); return; }
    setLoading(true);
    try {
      await api.changePassword(user.id, oldPassword, newPassword);
      toast.success("Đổi mật khẩu thành công.");
      setOldPassword(""); setNewPassword(""); setConfirm("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Đổi mật khẩu</h1>
      <p className="text-gray-500 text-sm mb-6">Cập nhật mật khẩu đăng nhập của bạn.</p>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="text-sm font-medium text-ink">Mật khẩu hiện tại</label>
            <input required type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Mật khẩu mới</label>
            <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Xác nhận mật khẩu mới</label>
            <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50" />
          </div>
          <button disabled={loading} className="px-4 py-2.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold disabled:opacity-60">
            {loading ? "Đang lưu..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </Card>
    </div>
  );
}
