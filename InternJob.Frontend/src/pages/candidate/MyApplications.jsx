import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../mockapi";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { EmptyState, SkeletonList } from "../../components/common/States";
import { FilterBar, FilterSelect } from "../../components/common/SearchFilterBar";

const STATUS_OPTIONS = [
  { value: "reviewing", label: "Đang xem xét" },
  { value: "viewed", label: "Đã xem" },
  { value: "interview", label: "Phỏng vấn" },
  { value: "hired", label: "Được nhận" },
  { value: "rejected", label: "Từ chối" },
];

export default function MyApplications() {
  const { user } = useAuth();
  const toast = useToast();
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [aiLoadingId, setAiLoadingId] = useState(null);

  useEffect(() => { load(); }, [user.id]);

  async function load() {
    setLoading(true);
    const applications = await api.getApplications({ candidateId: user.id });
    const allJobs = await api.getJobs();
    setJobs(Object.fromEntries(allJobs.map((j) => [j.id, j])));
    setApps(applications);
    setLoading(false);
  }

  async function runAIReview(app) {
    setAiLoadingId(app.id);
    try {
      await api.aiReviewCV({ candidateId: user.id, jobId: app.jobId });
      toast.success("AI đã hoàn tất đánh giá CV. Xem chi tiết trong Lịch sử AI.");
    } finally {
      setAiLoadingId(null);
    }
  }

  async function runAIQuestions(app) {
    setAiLoadingId(app.id + "_q");
    try {
      await api.aiGenerateInterviewQuestions({ candidateId: user.id, jobId: app.jobId });
      toast.success("AI đã tạo câu hỏi phỏng vấn. Xem chi tiết trong Lịch sử AI.");
    } finally {
      setAiLoadingId(null);
    }
  }

  const filtered = status ? apps.filter((a) => a.status === status) : apps;

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Hồ sơ ứng tuyển</h1>
      <p className="text-gray-500 text-sm mb-6">Theo dõi trạng thái các công việc bạn đã ứng tuyển.</p>

      <FilterBar>
        <FilterSelect value={status} onChange={setStatus} placeholder="Tất cả trạng thái" options={STATUS_OPTIONS} />
      </FilterBar>

      {loading ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <EmptyState title="Chưa có hồ sơ ứng tuyển" description="Hãy tìm việc làm phù hợp và ứng tuyển ngay." action={<Link to="/candidate/jobs" className="text-teal-600 font-semibold text-sm hover:underline">Tìm việc làm →</Link>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const job = jobs[app.jobId];
            if (!job) return null;
            return (
              <Card key={app.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link to={`/candidate/jobs/${job.id}`} className="font-display font-bold text-ink hover:text-teal-600">{job.title}</Link>
                    <p className="text-sm text-gray-500 mt-0.5">{job.location} · Ứng tuyển ngày {app.appliedAt}</p>
                  </div>
                  <Badge status={app.status} />
                </div>
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-navy-50">
                  <button disabled={aiLoadingId === app.id} onClick={() => runAIReview(app)} className="text-sm font-semibold text-navy-700 hover:underline disabled:opacity-50">
                    {aiLoadingId === app.id ? "Đang phân tích..." : "🤖 AI đánh giá CV"}
                  </button>
                  <button disabled={aiLoadingId === app.id + "_q"} onClick={() => runAIQuestions(app)} className="text-sm font-semibold text-navy-700 hover:underline disabled:opacity-50">
                    {aiLoadingId === app.id + "_q" ? "Đang tạo..." : "🎯 Sinh câu hỏi phỏng vấn"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
