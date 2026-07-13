import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import * as api from "../../mockapi";
import JobCard from "../../components/job/JobCard";

export default function Landing() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getJobs({ status: "open" }).then((j) => setJobs(j.slice(0, 4)));
    api.getCategories().then(setCategories);
  }, []);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || "";

  return (
    <div>
      <section className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-display font-extrabold text-4xl leading-tight">
              Tìm việc nhanh, <span className="text-teal-400">ứng tuyển thông minh</span> cùng AI
            </h1>
            <p className="text-navy-200 mt-4 text-base">
              Nền tảng tuyển dụng giúp ứng viên đánh giá CV, luyện phỏng vấn bằng AI — và giúp nhà tuyển dụng tìm đúng người, đúng lúc.
            </p>
            <div className="flex gap-3 mt-7">
              <Link to="/register" className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 font-semibold text-sm">Bắt đầu ngay</Link>
              <Link to="/jobs" className="px-6 py-3 rounded-lg border border-navy-500 hover:bg-navy-700 font-semibold text-sm">Xem việc làm</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["4,200+ Việc làm", "1,800+ Doanh nghiệp", "AI Review CV", "Phỏng vấn thử với AI"].map((t) => (
              <div key={t} className="bg-navy-700/60 border border-navy-600 rounded-xl2 p-5">
                <p className="font-display font-bold text-white">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-ink">Việc làm nổi bật</h2>
          <Link to="/jobs" className="text-sm font-semibold text-teal-600 hover:underline">Xem tất cả →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} categoryName={categoryName(job.categoryId)} detailPath={`/jobs/${job.id}`} />
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-navy-50">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: "🤖", title: "AI đánh giá CV", desc: "Nhận điểm phù hợp và gợi ý cải thiện CV ngay lập tức." },
            { icon: "🎯", title: "Câu hỏi phỏng vấn AI", desc: "Luyện tập với bộ câu hỏi phỏng vấn được tạo riêng cho từng vị trí." },
            { icon: "📊", title: "Theo dõi ứng tuyển", desc: "Quản lý toàn bộ hồ sơ ứng tuyển và trạng thái xét duyệt." },
          ].map((f) => (
            <div key={f.title} className="p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-ink">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
