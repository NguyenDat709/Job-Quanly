import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getCandidateProfile(user.id).then((p) => { setProfile(p); setForm({ ...p, fullName: user.fullName, phone: user.phone }); });
  }, [user.id]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateUser(user.id, { fullName: form.fullName, phone: form.phone });
      const updated = await api.updateCandidateProfile(user.id, {
        skills: form.skills, education: form.education, experience: form.experience,
      });
      refreshUser({ fullName: form.fullName, phone: form.phone });
      setProfile(updated);
      setEditing(false);
      toast.success("Cập nhật hồ sơ thành công.");
    } finally {
      setSaving(false);
    }
  }

  if (!profile || !form) return null;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-extrabold text-2xl text-ink">Hồ sơ cá nhân</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold">
            Chỉnh sửa
          </button>
        )}
      </div>

      <Card>
        <div className="flex items-center gap-4 pb-5 border-b border-navy-50 mb-5">
          <div className="w-16 h-16 rounded-full bg-navy-800 text-white flex items-center justify-center text-xl font-bold">
            {user.fullName?.[0]}
          </div>
          <div>
            <p className="font-display font-bold text-ink">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <Field label="Họ và tên"><input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="input" /></Field>
            <Field label="Số điện thoại"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input" /></Field>
            <Field label="Kỹ năng (phân cách bằng dấu phẩy)">
              <input value={form.skills.join(", ")} onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="input" />
            </Field>
            <Field label="Học vấn"><input value={form.education} onChange={(e) => set("education", e.target.value)} className="input" /></Field>
            <Field label="Kinh nghiệm"><textarea rows={3} value={form.experience} onChange={(e) => set("experience", e.target.value)} className="input" /></Field>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
            </div>
          </div>
        ) : (
          <dl className="space-y-4 text-sm">
            <Row label="Số điện thoại" value={user.phone} />
            <Row label="Kỹ năng" value={profile.skills.join(", ") || "—"} />
            <Row label="Học vấn" value={profile.education || "—"} />
            <Row label="Kinh nghiệm" value={profile.experience || "—"} />
          </dl>
        )}
      </Card>

      <Link to="/candidate/change-password" className="inline-block mt-4 text-sm text-teal-600 font-semibold hover:underline">Đổi mật khẩu →</Link>

      <style>{`.input { width:100%; padding: .6rem .85rem; border-radius:.5rem; border:1px solid #d7e1ee; font-size:.875rem; } .input:focus { outline:none; box-shadow:0 0 0 2px rgba(45,212,191,.5); }`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="text-sm font-medium text-ink block mb-1">{label}</label>{children}</div>;
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-navy-50 pb-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-ink font-medium text-right max-w-[60%]">{value}</dd>
    </div>
  );
}
