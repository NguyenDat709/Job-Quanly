import { Link } from "react-router-dom";
import Badge from "../common/Badge";

export default function JobCard({ job, categoryName, detailPath }) {
  const formatSalary = (min, max) => {
    const minM=min/1000000;
    const maxM=max/1000000;
    return `${minM}–${maxM} triệu`;
  }
  return (
    <Link to={detailPath} className="block bg-white rounded-xl2 shadow-card border border-navy-50 p-5 hover:border-teal-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-ink truncate">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{categoryName} · {job.location}</p>
        </div>
        <Badge status={job.status} />
      </div>
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-teal-700 font-mono-num font-semibold text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        <span className="text-xs text-gray-400">Hạn nộp: {job.deadline}</span>
      </div>
    </Link>
  );
}
