import { useEffect, useState } from "react";
import * as api from "../../mockapi";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Modal, { DeleteDialog } from "../../components/common/Modal";

const EMPTY = { name: "", description: "" };

export default function CategoryManage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); setCategories(await api.getCategories()); setLoading(false); }

  function openCreate() { setEditing(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(cat) { setEditing(cat); setForm({ name: cat.name, description: cat.description }); setModalOpen(true); }

  async function handleSave() {
    if (editing) await api.updateCategory(editing.id, form);
    else await api.createCategory(form);
    toast.success(editing ? "Đã cập nhật ngành nghề." : "Đã thêm ngành nghề mới.");
    setModalOpen(false);
    load();
  }

  async function confirmDelete() {
    await api.deleteCategory(toDelete);
    toast.success("Đã xóa ngành nghề.");
    setToDelete(null);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-ink">Danh mục ngành nghề</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh mục dùng để phân loại tin tuyển dụng.</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold">+ Thêm ngành nghề</button>
      </div>

      <Card>
        {!loading && (
          <Table
            columns={[
              { key: "name", header: "Tên ngành" },
              { key: "description", header: "Mô tả" },
              { key: "actions", header: "", render: (r) => (
                <div className="flex gap-3 justify-end text-sm">
                  <button onClick={() => openEdit(r)} className="text-navy-600 font-semibold hover:underline">Sửa</button>
                  <button onClick={() => setToDelete(r.id)} className="text-coral-600 font-semibold hover:underline">Xóa</button>
                </div>
              ) },
            ]}
            rows={categories}
          />
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Sửa ngành nghề" : "Thêm ngành nghề"}
        footer={<>
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700">Lưu</button>
        </>}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Tên ngành</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1">Mô tả</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-navy-100 text-sm" />
          </div>
        </div>
      </Modal>

      <DeleteDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} message="Xóa ngành nghề này? Các tin tuyển dụng liên quan sẽ mất phân loại." />
    </div>
  );
}
