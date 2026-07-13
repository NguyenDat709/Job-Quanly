import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import * as api from "../../mockapi";
import Card from "../../components/common/Card";
import { EmptyState } from "../../components/common/States";
import { DeleteDialog } from "../../components/common/Modal";

export default function UploadCV() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const jobId = params.get("jobId");
  const fileInput = useRef(null);

  const [cvs, setCvs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { api.getCandidateCVs(user.id).then(setCvs); }, [user.id]);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true); setProgress(0);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 20, 90)), 100);
    try {
      const cv = await api.uploadCV(user.id, file);
      setProgress(100);
      setCvs((c) => [...c, cv]);
      toast.success("Tải CV lên thành công.");
      if (jobId) setTimeout(() => navigate(`/candidate/jobs/${jobId}`), 500);
    } catch (e) {
      toast.error(e.message);
    } finally {
      clearInterval(interval);
      setTimeout(() => setUploading(false), 400);
    }
  }

  async function confirmDelete() {
    await api.deleteCV(toDelete);
    setCvs((c) => c.filter((x) => x.id !== toDelete));
    setToDelete(null);
    toast.success("Đã xóa CV.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Quản lý CV</h1>
      <p className="text-gray-500 text-sm mb-6">
        {jobId ? "Bạn cần tải CV lên trước khi ứng tuyển." : "Tải lên và quản lý các CV của bạn."}
      </p>

      <Card>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileInput.current.click()}
          className={`border-2 border-dashed rounded-xl2 p-10 text-center cursor-pointer transition-colors ${dragOver ? "border-teal-400 bg-teal-50" : "border-navy-100"}`}
        >
          <div className="text-3xl mb-2">📤</div>
          <p className="text-sm font-medium text-ink">Kéo thả tệp vào đây hoặc nhấn để chọn</p>
          <p className="text-xs text-gray-400 mt-1">Chỉ chấp nhận tệp PDF hoặc DOCX, tối đa 5MB</p>
          <input ref={fileInput} type="file" accept=".pdf,.docx" hidden onChange={(e) => handleFile(e.target.files[0])} />
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Đang tải lên... {progress}%</p>
          </div>
        )}
      </Card>

      <Card title="CV của bạn" className="mt-5">
        {cvs.length === 0 ? (
          <EmptyState title="Chưa có CV nào" description="Tải lên CV đầu tiên để bắt đầu ứng tuyển." icon="📄" />
        ) : (
          <ul className="divide-y divide-navy-50">
            {cvs.map((cv) => (
              <li key={cv.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{cv.fileName}</p>
                    <p className="text-xs text-gray-400">Tải lên {cv.uploadedAt} · {cv.sizeKb} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button className="text-navy-600 font-semibold hover:underline">Xem</button>
                  <button className="text-navy-600 font-semibold hover:underline">Tải xuống</button>
                  <button onClick={() => setToDelete(cv.id)} className="text-coral-600 font-semibold hover:underline">Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {jobId && <Link to={`/candidate/jobs/${jobId}`} className="inline-block mt-4 text-sm text-teal-600 font-semibold hover:underline">← Quay lại tin tuyển dụng</Link>}

      <DeleteDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} message="Bạn có chắc muốn xóa CV này?" />
    </div>
  );
}
