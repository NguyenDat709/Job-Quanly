import JobBrowser from "../../components/job/JobBrowser";

export default function JobListPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Việc làm đang tuyển</h1>
      <p className="text-gray-500 text-sm mb-6">Đăng nhập bằng tài khoản ứng viên để ứng tuyển và theo dõi hồ sơ.</p>
      <JobBrowser detailBasePath="/jobs" />
    </div>
  );
}
