import { useEffect, useState } from "react";
import * as api from "../../mockapi";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { DeleteDialog } from "../../components/common/Modal";
import { SearchBar, FilterBar, FilterSelect } from "../../components/common/SearchFilterBar";
import { SkeletonList } from "../../components/common/States";

export default function AdminUserManage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); setUsers(await api.getUsers()); setLoading(false); }

  async function confirmDelete() {
    await api.deleteUser(toDelete);
    toast.success("Đã xóa người dùng.");
    setToDelete(null);
    load();
  }

  const filtered = users.filter((u) => {
    if (keyword && !u.fullName.toLowerCase().includes(keyword.toLowerCase()) && !u.email.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (role && u.role !== role) return false;
    return true;
  });

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Quản lý người dùng</h1>
      <p className="text-gray-500 text-sm mb-6">Toàn bộ tài khoản ứng viên, nhà tuyển dụng và quản trị viên.</p>

      <FilterBar>
        <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm theo tên hoặc email..." />
        <FilterSelect value={role} onChange={setRole} placeholder="Tất cả vai trò" options={[
          { value: "candidate", label: "Ứng viên" }, { value: "employer", label: "Nhà tuyển dụng" }, { value: "admin", label: "Quản trị viên" },
        ]} />
      </FilterBar>

      <Card>
        {loading ? <SkeletonList count={4} /> : (
          <Table
            columns={[
              { key: "fullName", header: "Họ tên" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Điện thoại" },
              { key: "role", header: "Vai trò", render: (r) => <Badge status={r.role} /> },
              { key: "createdAt", header: "Ngày tạo" },
              { key: "actions", header: "", render: (r) => (
                <button onClick={() => setToDelete(r.id)} className="text-coral-600 font-semibold text-sm hover:underline">Xóa</button>
              ) },
            ]}
            rows={filtered}
          />
        )}
      </Card>

      <DeleteDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} message="Xóa người dùng này khỏi hệ thống?" />
    </div>
  );
}
