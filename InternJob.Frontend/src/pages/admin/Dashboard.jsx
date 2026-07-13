import { useEffect, useState } from "react";
import * as api from "../../mockapi";
import { StatCard } from "../../components/common/Card";
import Card from "../../components/common/Card";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.getAdminStats().then(setStats); }, []);

  if (!stats) return null;
  const maxUserGrowth = Math.max(1, ...stats.userGrowth.map((g) => g.count));
  const maxJobGrowth = Math.max(1, ...stats.jobGrowth.map((g) => g.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-ink">Tổng quan hệ thống</h1>
        <p className="text-gray-500 text-sm mt-1">Số liệu tổng hợp toàn bộ nền tảng.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Tổng người dùng" value={stats.totalUsers} icon="👥" accent="navy" />
        <StatCard label="Tổng ứng viên" value={stats.totalCandidates} icon="🧑‍💼" accent="teal" />
        <StatCard label="Tổng nhà tuyển dụng" value={stats.totalEmployers} icon="🏢" accent="coral" />
        <StatCard label="Tổng tin tuyển dụng" value={stats.totalJobs} icon="📋" accent="navy" />
        <StatCard label="Tổng hồ sơ ứng tuyển" value={stats.totalApplications} icon="📨" accent="teal" />
        <StatCard label="Lượt dùng AI" value={stats.aiUsageCount} icon="🤖" accent="coral" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Tăng trưởng người dùng theo tháng">
          <BarChart data={stats.userGrowth} max={maxUserGrowth} color="bg-navy-600" />
        </Card>
        <Card title="Số tin tuyển dụng theo tháng">
          <BarChart data={stats.jobGrowth} max={maxJobGrowth} color="bg-teal-500" />
        </Card>
      </div>
    </div>
  );
}

function BarChart({ data, max, color }) {
  if (!data.length) return <p className="text-sm text-gray-400">Chưa có dữ liệu</p>;
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center justify-end gap-1.5">
          <span className="text-xs font-mono-num text-gray-500">{d.count}</span>
          <div className={`w-full rounded-t-md ${color}`} style={{ height: `${(d.count / max) * 100}%`, minHeight: 4 }} />
          <span className="text-[10px] text-gray-400">{d.month.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}
