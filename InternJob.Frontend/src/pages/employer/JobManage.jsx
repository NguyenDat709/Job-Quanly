import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../mockapi/api";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { DeleteDialog } from "../../components/common/Modal";
import { SearchBar, FilterBar, FilterSelect } from "../../components/common/SearchFilterBar";
import { SkeletonList } from "../../components/common/States";

export default function EmployerJobManage() {
  const { user } = useAuth();
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { load(); }, [user.id]);

 async function load() {
  setLoading(true);

  try {
    const res = await api.get("/Job/my");
    setJobs(res.data);
  } catch (e) {
    toast.error("Không tải được danh sách tin tuyển dụng");
  } finally {
    setLoading(false);
  }
}
  async function toggleStatus(job) {
  try {
    await api.patch(`/Job/${job.jobId}/close`);

    toast.success("Đã đóng tin tuyển dụng.");

    load();
  } catch (e) {
    toast.error(e.response?.data?.message || "Có lỗi xảy ra");
  }
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-ink">Tin tuyển dụng của tôi</h1>
          <p className="text-gray-500 text-sm mt-1">Bạn chỉ có thể quản lý các tin do chính mình đăng.</p>
        </div>
        <Link to="/employer/jobs/new" className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold">+ Đăng tin mới</Link>
      </div>

      <FilterBar>
        <SearchBar value={keyword} onChange={setKeyword} placeholder="Tìm theo tên vị trí..." />
        <FilterSelect value={status} onChange={setStatus} placeholder="Tất cả trạng thái" options={[
          { value: "open", label: "Đang tuyển" }, { value: "closed", label: "Đã đóng" }, { value: "expired", label: "Hết hạn" },
        ]} />
      </FilterBar>

      <Card>
        {loading ? <SkeletonList count={3} /> : (
          <Table
            emptyLabel="Bạn chưa đăng tin tuyển dụng nào"
            columns={[
              { key: "title", header: "Vị trí", render: (r) => <Link to={`/employer/jobs/${r.jobId}/edit`} className="font-medium text-ink hover:text-teal-600">{r.title}</Link> },
              { key: "location", header: "Địa điểm" },
              { key: "deadline", header: "Hạn tuyển" },
              { key: "status", header: "Trạng thái", render: (r) => <Badge status={r.status} /> },
              {
                key: "actions", header: "", render: (r) => (
                  <div className="flex items-center gap-3 text-sm justify-end">
                    <Link to={`/employer/jobs/${r.jobId}/edit`} className="text-navy-600 font-semibold hover:underline">Sửa</Link>
                    {r.status !== "expired" && (
                      <button onClick={() => toggleStatus(r)} className="text-navy-600 font-semibold hover:underline">
                        {r.status === "open" ? "Mở lại" : "Đóng tin"}
                      </button>
                    )}
                    {/* <button onClick={() => setToDelete(r.id)} className="text-coral-600 font-semibold hover:underline">Xóa</button> */}
                  </div>
                )
              },
            ]}
            rows={filtered}
          />
        )}
      </Card>

      <DeleteDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} message="Xóa tin tuyển dụng này? Hành động không thể hoàn tác." />
    </div>
  );
}
