import Breadcrumb from "../../components/common/Breadcrumb";
import JobDetail from "../../components/job/JobDetail";

export default function JobDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Breadcrumb items={[{ label: "Trang chủ", to: "/" }, { label: "Việc làm", to: "/jobs" }, { label: "Chi tiết" }]} />
      <JobDetail />
    </div>
  );
}
