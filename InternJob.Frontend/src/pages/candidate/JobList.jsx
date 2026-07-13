import JobBrowser from "../../components/job/JobBrowser";

export default function CandidateJobList() {
  return (
    <div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Tìm việc làm</h1>
      <p className="text-gray-500 text-sm mb-6">Tìm và ứng tuyển những vị trí phù hợp với bạn.</p>
      <JobBrowser detailBasePath="/candidate/jobs" />
    </div>
  );
}
