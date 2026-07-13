import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";

export default function CompanyProfile() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.getEmployerProfile(user.id).then((p) => { setProfile(p); setForm({ ...p, fullName: user.fullName, phone: user.phone }); }); }, [user.id]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateUser(user.id, { fullName: form.fullName, phone: form.phone });
      const updated = await api.updateEmployerProfile(user.id, {
        companyName: form.companyName, description: form.description, website: form.website,
      });
      refreshUser({ fullName: form.fullName, phone: form.phone });
      setProfile(updated);
      setEditing(false);
      toast.success("Cập nhật hồ sơ công ty thành công.");
    } finally {
      setSaving(false);
    }
  }

  if (!profile || !form) return null;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-extrabold text-2xl text-ink">Hồ sơ công ty</h1>
        {!editing && <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold">Chỉnh sửa</button>}
      </div>
      <Card>
        {editing ? (
          <div className="space-y-4">
            <Field label="Tên công ty"><input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} className="input" /></Field>
            <Field label="Website"><input value={form.website} onChange={(e) => set("website", e.target.value)} className="input" /></Field>
            <Field label="Mô tả doanh nghiệp"><textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="input" /></Field>
            <Field label="Người liên hệ"><input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="input" /></Field>
            <Field label="Số điện thoại"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="input" /></Field>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
            </div>
          </div>
        ) : (
          <dl className="space-y-4 text-sm">
            <Row label="Tên công ty" value={profile.companyName || "—"} />
            <Row label="Website" value={profile.website || "—"} />
            <Row label="Mô tả" value={profile.description || "—"} />
            <Row label="Người liên hệ" value={user.fullName} />
            <Row label="Số điện thoại" value={user.phone} />
          </dl>
        )}
      </Card>
      <style>{`.input { width:100%; padding: .6rem .85rem; border-radius:.5rem; border:1px solid #d7e1ee; font-size:.875rem; } .input:focus { outline:none; box-shadow:0 0 0 2px rgba(45,212,191,.5); }`}</style>
    </div>
  );
}

function Field({ label, children }) { return <div><label className="text-sm font-medium text-ink block mb-1">{label}</label>{children}</div>; }
function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-navy-50 pb-3">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-ink font-medium text-right max-w-[60%]">{value}</dd>
    </div>
  );
}
