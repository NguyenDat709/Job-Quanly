import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../mockapi";
import { StatCard } from "../../components/common/Card";
import Card from "../../components/common/Card";
import JobCard from "../../components/job/JobCard";
import { EmptyState } from "../../components/common/States";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aiHistory, setAiHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const [cvs, apps, jobs, cats, ai] = await Promise.all([
        api.getCandidateCVs(user.id),
        api.getApplications({ candidateId: user.id }),
        api.getJobs({ status: "open" }),
        api.getCategories(),
        api.getAIHistory(user.id),
      ]);
      setStats({ cvCount: cvs.length, appCount: apps.length });
      setSuggested(jobs.slice(0, 4));
      setCategories(cats);
      setAiHistory(ai.slice(0, 2));
    })();
  }, [user.id]);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-ink">Chào {user.fullName.split(" ").slice(-1)[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Đây là tổng quan hoạt động tìm việc của bạn.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CV đã tải lên" value={stats?.cvCount ?? "-"} icon="📄" accent="navy" />
        <StatCard label="Hồ sơ đã ứng tuyển" value={stats?.appCount ?? "-"} icon="📨" accent="teal" />
        <StatCard label="Công việc gợi ý" value={suggested.length} icon="🎯" accent="coral" />
        <StatCard label="Lượt dùng AI" value={aiHistory.length} icon="🤖" accent="navy" />
      </div>

      <Card title="Công việc gợi ý cho bạn" action={<Link to="/candidate/jobs" className="text-sm font-semibold text-teal-600 hover:underline">Xem tất cả →</Link>}>
        {suggested.length === 0 ? <EmptyState title="Chưa có gợi ý" /> : (
          <div className="grid md:grid-cols-2 gap-4">
            {suggested.map((job) => (
              <JobCard key={job.id} job={job} categoryName={categoryName(job.categoryId)} detailPath={`/candidate/jobs/${job.id}`} />
            ))}
          </div>
        )}
      </Card>

      
    </div>
  );
}
