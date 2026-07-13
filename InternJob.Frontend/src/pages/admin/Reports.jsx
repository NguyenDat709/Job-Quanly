import { useEffect, useState } from "react";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getJobs(), api.getCategories()]).then(([s, j, c]) => {
      setStats(s); setJobs(j); setCategories(c);
    });
  }, []);

  if (!stats) return null;

  const byCategory = categories.map((c) => ({
    ...c, count: jobs.filter((j) => j.categoryId === c.id).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-ink">Báo cáo thống kê</h1>
        <p className="text-gray-500 text-sm mt-1">Số liệu tổng hợp theo ngành nghề và hoạt động AI.</p>
      </div>

      <Card title="Số lượng tin tuyển dụng theo ngành nghề">
        <Table
          columns={[
            { key: "name", header: "Ngành nghề" },
            { key: "count", header: "Số tin", render: (r) => <span className="font-mono-num font-semibold">{r.count}</span> },
          ]}
          rows={byCategory}
        />
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Tỷ lệ tin đang mở">
          <p className="text-3xl font-mono-num font-bold text-teal-600">{Math.round((stats.openJobs / (stats.totalJobs || 1)) * 100)}%</p>
          <p className="text-sm text-gray-500 mt-1">{stats.openJobs}/{stats.totalJobs} tin đang tuyển</p>
        </Card>
        <Card title="Hồ sơ ứng tuyển / tin">
          <p className="text-3xl font-mono-num font-bold text-navy-700">{(stats.totalApplications / (stats.totalJobs || 1)).toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-1">trung bình mỗi tin tuyển dụng</p>
        </Card>
        <Card title="Lượt sử dụng AI">
          <p className="text-3xl font-mono-num font-bold text-coral-500">{stats.aiUsageCount}</p>
          <p className="text-sm text-gray-500 mt-1">đánh giá CV & sinh câu hỏi phỏng vấn</p>
        </Card>
      </div>
    </div>
  );
}
