import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as api from "../../mockapi";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Badge from "../common/Badge";
import Card from "../common/Card";
import { SkeletonCard } from "../common/States";
import Modal from "../common/Modal";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [category, setCategory] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [submitting, setSubmitting] = useState(false);
useEffect(() => {
  let alive = true;
  setLoading(true);
  axios.get(`http://localhost:5248/api/Job/${id}`)
    .then(response => {
      if (alive) {
        setJob(response.data);
        setLoading(false);
      }
    })
    .catch(error => {
      console.error("Lỗi:", error);
      setLoading(false);
    });
  return () => { alive = false; };
}, [id]);

  function handleApplyClick() {
    if (!user) { navigate("/login", { state: { from: `/jobs/${id}` } }); return; }
    if (user.role !== "candidate") return;
    if (cvs.length === 0) { navigate(`/candidate/upload-cv?jobId=${id}`); return; }
    setApplyOpen(true);
  }

  async function confirmApply() {
    setSubmitting(true);
    try {
      const app = await api.applyToJob({ jobId: id, candidateId: user.id, cvId: selectedCvId });
      setMyApplication(app);
      setApplyOpen(false);
      toast.success("Ứng tuyển thành công! Bạn có thể theo dõi trạng thái trong mục Hồ sơ ứng tuyển.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <SkeletonCard />;
  if (!job) return <p className="text-gray-500">Không tìm thấy tin tuyển dụng.</p>;

  const isExpired = job.status === "expired";

  const formatSalary = (min, max) => {
      const minM = min / 1000000;
      const maxM = max / 1000000;
      return `${minM}–${maxM} triệu`; 
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-xl text-ink">{job.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{category?.name} · {job.location}</p>
            </div>
            <Badge status={job.status} />
          </div>
         <p className="text-teal-700 font-mono-num font-bold mt-4">
              {formatSalary(job.salaryMin, job.salaryMax)} / tháng
          </p>
        </Card>
        <Card title="Mô tả công việc"><p className="text-sm text-gray-600 whitespace-pre-line">{job.description}</p></Card>
        <Card title="Yêu cầu ứng viên"><p className="text-sm text-gray-600 whitespace-pre-line">{job.requirements}</p></Card>
      </div>

      <div className="space-y-4">
        <Card>
          <p className="text-sm text-gray-500 mb-3">Hạn nộp hồ sơ: <span className="font-semibold text-ink">{job.deadline}</span></p>

          {!user || user.role === "candidate" ? (
            isExpired ? (
              <>
                <button disabled className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-500 font-semibold text-sm cursor-not-allowed">Ứng tuyển</button>
                <p className="text-xs text-red-500 mt-2">Tin tuyển dụng này đã hết hạn nộp hồ sơ.</p>
              </>
            ) : myApplication ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">Bạn đã ứng tuyển vị trí này</p>
                <Badge status={myApplication.status} />
                <Link to="/candidate/applications" className="block text-center mt-3 text-sm text-teal-600 font-semibold hover:underline">Xem trạng thái hồ sơ</Link>
              </div>
            ) : (
              <button onClick={handleApplyClick} className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm">
                Ứng tuyển ngay
              </button>
            )
          ) : (
            <p className="text-xs text-gray-400">Chỉ tài khoản ứng viên mới có thể ứng tuyển.</p>
          )}
        </Card>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Xác nhận ứng tuyển"
        footer={
          <>
            <button onClick={() => setApplyOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100">Hủy</button>
            <button disabled={submitting || !selectedCvId} onClick={confirmApply} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50">
              {submitting ? "Đang gửi..." : "Xác nhận"}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 mb-3">Chọn CV để ứng tuyển vào vị trí <strong>{job.title}</strong>:</p>
        <div className="space-y-2">
          {cvs.map((cv) => (
            <label key={cv.id} className="flex items-center gap-3 p-3 rounded-lg border border-navy-100 cursor-pointer has-[:checked]:border-teal-400 has-[:checked]:bg-teal-50">
              <input type="radio" name="cv" checked={selectedCvId === cv.id} onChange={() => setSelectedCvId(cv.id)} />
              <span className="text-sm text-ink">{cv.fileName}</span>
            </label>
          ))}
        </div>
        <Link to={`/candidate/upload-cv?jobId=${id}`} className="block mt-3 text-sm text-teal-600 font-semibold hover:underline">+ Upload CV khác</Link>
      </Modal>
    </div>
  );
}
