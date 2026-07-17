import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../mockapi/api";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import { FilterBar, FilterSelect } from "../../components/common/SearchFilterBar";
import { SkeletonList } from "../../components/common/States";
const STATUS_FLOW = ["reviewing", "viewed", "interview", "hired", "rejected"];
const STATUS_LABEL = { reviewing: "Đang xem xét", viewed: "Đã xem", interview: "Phỏng vấn", hired: "Được nhận", rejected: "Từ chối" };
export default function CandidateList() {
  const { user } = useAuth();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobFilter, setJobFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  useEffect(() => { load(); }, [user.id]);
async function load() {
  setLoading(true);
  try {
    const response = await api.get("/Application/employer");
    setRows(response.data); 
  } catch (error) {
    toast.error("Không thể tải danh sách ứng viên");
  } finally {
    setLoading(false);
  }
}

  async function setStatus(app, status) {
  try {
    await api.patch(`/Application/${app.applicationId}/status`, { status });
    toast.success(`Đã cập nhật trạng thái`);
    load();
  } catch (error) {
    toast.error("Cập nhật thất bại");
  }
}
  const filtered = jobFilter ? rows.filter((r) => r.jobId === jobFilter) : rows;
  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Ứng viên</h1>
      <p className="text-gray-500 text-sm mb-6">Danh sách ứng viên đã ứng tuyển vào các tin của bạn.</p>
      <FilterBar>
        <FilterSelect value={jobFilter} onChange={setJobFilter} placeholder="Tất cả tin tuyển dụng" options={jobs.map((j) => ({ value: j.id, label: j.title }))} />
      </FilterBar>

      <Card>
        {loading ? <SkeletonList count={3} /> : (
          <Table
            emptyLabel="Chưa có ứng viên nào"
          columns={[
          
            { 
              key: "jobTitle", 
              header: "Vị trí", 
              render: (r) => <span className="text-navy-700 font-medium">{r.jobTitle}</span> 
            },
            { 
              key: "appliedAt", 
              header: "Ngày ứng tuyển", 
              render: (r) => new Date(r.appliedAt).toLocaleDateString('vi-VN') 
            },
           {
              key: "status",
              header: "Trạng thái",
              render: (r) => (
                <select
                  value={r.status}
                  onChange={(e) => setStatus(r, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value="Reviewing">Đang xem xét</option>
                  <option value="Viewed">Đã xem</option>
                  <option value="Interviewing">Phỏng vấn</option>
                  <option value="Accepted">Được nhận</option>
                  <option value="Rejected">Từ chối</option>
                </select>
              )
            },
            {
            key: "actions", 
            header: "Thao tác", 
            render: (r) => (
              <div className="flex items-center gap-3  pr-4"> 
                <button
                  onClick={() =>
                    window.open( 
                      `http://localhost:5248${r.cvPath}`,
                      "_blank"
                    )
                  }
                  className="text-navy-600 font-semibold hover:underline cursor-pointer"
                >
                  Xem CV
                </button>
              </div>
              )
            },
          ]}
            rows={filtered}
          />
        )}
      </Card>
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Chi tiết CV ứng viên">
        {viewing && (
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-500">Ứng viên:</span> <span className="font-medium text-ink">{viewing.candidate?.fullName}</span></p>
            <p><span className="text-gray-500">Email:</span> {viewing.candidate?.email}</p>
            <p><span className="text-gray-500">Vị trí:</span> {viewing.job?.title}</p>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-50">
              <span className="text-xl">📄</span>
              <div>
                <p className="font-medium text-ink">{viewing.cv?.fileName || "Chưa có CV"}</p>
                {viewing.cv && <p className="text-xs text-gray-500">Tải lên {viewing.cv.uploadedAt}</p>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
