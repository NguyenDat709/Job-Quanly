import Breadcrumb from "../../components/common/Breadcrumb";
import JobDetail from "../../components/job/JobDetail";

export default function CandidateJobDetailPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Tổng quan", to: "/candidate/dashboard" }, { label: "Việc làm", to: "/candidate/jobs" }, { label: "Chi tiết" }]} />
      <JobDetail />
    </div>
  );
}
