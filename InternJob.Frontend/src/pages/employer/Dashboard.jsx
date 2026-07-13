import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../mockapi";
import { StatCard } from "../../components/common/Card";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import { EmptyState } from "../../components/common/States";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      const [j, a] = await Promise.all([
        api.getJobs({ employerId: user.id }),
        api.getApplications({ employerId: user.id }),
      ]);
      setJobs(j); setApps(a);
    })();
  }, [user.id]);

  const open = jobs.filter((j) => j.status === "open").length;
  const closed = jobs.length - open;
  const appsByJob = jobs.map((j) => ({ ...j, count: apps.filter((a) => a.jobId === j.id).length }))
    .sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-ink">Tổng quan tuyển dụng</h1>
          <p className="text-gray-500 text-sm mt-1">{user.fullName} — quản lý tin tuyển dụng của bạn.</p>
        </div>
        <Link to="/employer/jobs/new" className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold">+ Đăng tin mới</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng tin tuyển dụng" value={jobs.length} icon="📋" accent="navy" />
        <StatCard label="Tin đang mở" value={open} icon="✅" accent="teal" />
        <StatCard label="Tin đã đóng/hết hạn" value={closed} icon="🗂️" accent="coral" />
        <StatCard label="Ứng viên mới" value={apps.length} icon="🧑‍💼" accent="navy" />
      </div>

      <Card title="Top công việc có nhiều ứng viên">
        {appsByJob.length === 0 ? <EmptyState title="Chưa có dữ liệu" /> : (
          <Table
            columns={[
              { key: "title", header: "Vị trí" },
              { key: "count", header: "Ứng viên", render: (r) => <span className="font-mono-num font-semibold">{r.count}</span> },
              { key: "status", header: "Trạng thái", render: (r) => <Badge status={r.status} /> },
            ]}
            rows={appsByJob}
          />
        )}
      </Card>
    </div>
  );
}
