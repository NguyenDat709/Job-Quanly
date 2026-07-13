import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";
import Breadcrumb from "../../components/common/Breadcrumb";

const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
const EMPTY = { title: "", description: "", requirements: "", salaryMin: "", salaryMax: "", location: LOCATIONS[0], categoryId: "", deadline: "" };

export default function JobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then((cats) => {
      setCategories(cats);
      setForm((f) => (f.categoryId ? f : { ...f, categoryId: cats[0]?.id || "" }));
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.getJob(id).then((job) => {
      if (job) setForm({ ...job });
      setLoading(false);
    });
  }, [id, isEdit]);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (Number(form.salaryMin) > Number(form.salaryMax)) { setError("Mức lương tối thiểu phải nhỏ hơn hoặc bằng mức lương tối đa."); return; }
    setSaving(true);
    try {
      const payload = { ...form, salaryMin: Number(form.salaryMin), salaryMax: Number(form.salaryMax) };
      if (isEdit) {
        await api.updateJob(id, payload);
        toast.success("Cập nhật tin tuyển dụng thành công.");
      } else {
        await api.createJob(payload, user.id);
        toast.success("Đăng tin tuyển dụng thành công.");
      }
      navigate("/employer/jobs");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: "Tin tuyển dụng", to: "/employer/jobs" }, { label: isEdit ? "Chỉnh sửa" : "Đăng tin mới" }]} />
      <h1 className="font-display font-extrabold text-2xl text-ink mb-6">{isEdit ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}</h1>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-4">
          {error && <p className="text-sm text-coral-600 bg-coral-50 rounded-lg px-3 py-2">{error}</p>}
          <Field label="Tiêu đề công việc">
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" />
          </Field>
          <Field label="Mô tả công việc">
            <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="input" />
          </Field>
          <Field label="Yêu cầu ứng viên">
            <textarea required rows={3} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Lương tối thiểu (triệu)"><input required type="number" min="0" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} className="input" /></Field>
            <Field label="Lương tối đa (triệu)"><input required type="number" min="0" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} className="input" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Địa điểm">
              <select value={form.location} onChange={(e) => set("location", e.target.value)} className="input">
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Ngành nghề">
              <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Hạn nộp hồ sơ">
            <input required type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className="input" />
          </Field>

          <div className="flex gap-3 pt-2">
            <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold disabled:opacity-60">
              {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Đăng tin"}
            </button>
            <button type="button" onClick={() => navigate("/employer/jobs")} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
          </div>
        </Card>
      </form>
      <style>{`.input { width:100%; padding: .6rem .85rem; border-radius:.5rem; border:1px solid #d7e1ee; font-size:.875rem; } .input:focus { outline:none; box-shadow:0 0 0 2px rgba(45,212,191,.5); }`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="text-sm font-medium text-ink block mb-1">{label}</label>{children}</div>;
}
