import { useEffect, useState } from "react";
import * as api from "../../mockapi";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { DeleteDialog } from "../../components/common/Modal";
import { SearchBar, FilterBar, FilterSelect } from "../../components/common/SearchFilterBar";
import { SkeletonList } from "../../components/common/States";

export default function AdminJobManage() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [employers, setEmployers] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [j, users] = await Promise.all([api.getJobs(), api.getUsers({ role: "employer" })]);
    setJobs(j);
    setEmployers(Object.fromEntries(users.map((u) => [u.id, u])));
    setLoading(false);
  }

  async function confirmDelete() {
    await api.deleteJob(toDelete);
    toast.success("Đã xóa tin tuyển dụng.");
    setToDelete(null);
    load();
  }

  const filtered = jobs.filter((j) => {
    if (keyword && !j.title.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (status && j.status !== status) return false;
    return true;
  });

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Quản lý tin tuyển dụng</h1>
      <p className="text-gray-500 text-sm mb-6">Toàn bộ tin tuyển dụng trên hệ thống.</p>

      <FilterBar>
        <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm theo tên vị trí..." />
        <FilterSelect value={status} onChange={setStatus} placeholder="Tất cả trạng thái" options={[
          { value: "open", label: "Đang tuyển" }, { value: "closed", label: "Đã đóng" }, { value: "expired", label: "Hết hạn" },
        ]} />
      </FilterBar>

      <Card>
        {loading ? <SkeletonList count={4} /> : (
          <Table
            columns={[
              { key: "title", header: "Vị trí" },
              { key: "employer", header: "Nhà tuyển dụng", render: (r) => employers[r.employerId]?.fullName || "—" },
              { key: "location", header: "Địa điểm" },
              { key: "status", header: "Trạng thái", render: (r) => <Badge status={r.status} /> },
              { key: "actions", header: "", render: (r) => (
                <button onClick={() => setToDelete(r.id)} className="text-coral-600 font-semibold text-sm hover:underline">Xóa</button>
              ) },
            ]}
            rows={filtered}
          />
        )}
      </Card>

      <DeleteDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} message="Xóa tin tuyển dụng này khỏi hệ thống?" />
    </div>
  );
}
