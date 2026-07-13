import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as api from "../../mockapi";
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
    const [myJobs, apps, users, cvs] = await Promise.all([
      api.getJobs({ employerId: user.id }),
      api.getApplications({ employerId: user.id }),
      api.getUsers({ role: "candidate" }),
      Promise.resolve(null),
    ]);
    setJobs(myJobs);
    const jobById = Object.fromEntries(myJobs.map((j) => [j.id, j]));
    const userById = Object.fromEntries(users.map((u) => [u.id, u]));
    const cvLists = await Promise.all(users.map((u) => api.getCandidateCVs(u.id)));
    const cvById = Object.fromEntries(cvLists.flat().map((c) => [c.id, c]));
    setRows(apps.map((a) => ({ ...a, job: jobById[a.jobId], candidate: userById[a.candidateId], cv: cvById[a.cvId] })));
    setLoading(false);
  }

  async function setStatus(app, status) {
    await api.updateApplicationStatus(app.id, status);
    toast.success(`Đã cập nhật trạng thái: ${STATUS_LABEL[status]}`);
    load();
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
              { key: "candidate", header: "Ứng viên", render: (r) => <span className="font-medium text-ink">{r.candidate?.fullName}</span> },
              { key: "job", header: "Vị trí ứng tuyển", render: (r) => r.job?.title },
              { key: "appliedAt", header: "Ngày ứng tuyển" },
              { key: "status", header: "Trạng thái", render: (r) => <Badge status={r.status} /> },
              {
                key: "actions", header: "", render: (r) => (
                  <div className="flex items-center gap-3 text-sm justify-end">
                    <button onClick={() => setViewing(r)} className="text-navy-600 font-semibold hover:underline">Xem CV</button>
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r, e.target.value)}
                      className="text-xs border border-navy-100 rounded-lg px-2 py-1.5"
                    >
                      {STATUS_FLOW.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
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
