import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";
import { EmptyState, SkeletonList } from "../../components/common/States";

export default function AIHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAIHistory(user.id), api.getJobs()]).then(([h, j]) => {
      setHistory(h);
      setJobs(Object.fromEntries(j.map((x) => [x.id, x])));
      setLoading(false);
    });
  }, [user.id]);

  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Lịch sử AI</h1>
      <p className="text-gray-500 text-sm mb-6">Các lượt đánh giá CV và sinh câu hỏi phỏng vấn bằng AI.</p>

      {loading ? <SkeletonList /> : history.length === 0 ? (
        <EmptyState title="Chưa có hoạt động AI" icon="🤖" description="Dùng AI đánh giá CV ở mục Hồ sơ ứng tuyển." />
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <Card key={h.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-navy-700">
                  {h.type === "cv_review" ? "🤖 Đánh giá CV" : "🎯 Câu hỏi phỏng vấn"} — {jobs[h.jobId]?.title}
                </span>
                <span className="text-xs text-gray-400">{h.createdAt}</span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">{h.result}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
