import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../mockapi/api";
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

  const [cv, setCv] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { 
    api.get("/CV/myCV").then((res)=>setCv(res.data));
   }, []);

 async function handleFile(file) {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const res = await api.post("/CV/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setCv((c) => [...c, res.data]);
      toast.success("Tải CV lên thành công.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Lỗi upload!");
    } finally {
      setUploading(false);
    }
  }

 async function confirmDelete() {
  try {
    await api.delete(`/CV/${toDelete}`); 

    setCv((c) => c.filter((x) => x.cvId !== toDelete));
    setToDelete(null);
    toast.success("Đã xóa CV.");
  } catch (e) {
    console.error("Lỗi khi xóa:", e);
    toast.error("Không thể xóa CV. Vui lòng thử lại!");
  }
}
async function handleApply(cvId) {
  try {
    await api.post(`/Application/job/${jobId}`, {
      cvId: cvId
    });
    console.log(cvId);
    toast.success("Ứng tuyển thành công!");
    navigate(`/candidate/jobs/${jobId}`); 
  } catch (e) {
    console.log("Lỗi chi tiết" ,e.response?.data);
    toast.error("Lỗi khi ứng tuyển: " + (e.response?.data?.message || "Vui lòng thử lại"));
  }
}
  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Quản lý CV</h1>
      <p className="text-gray-500 text-sm mb-6">
        {jobId ? "Bạn cần tải CV lên trước khi ứng tuyển." : 
        "Tải lên và quản lý các CV của bạn."}
      </p>

      <Card>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false);
             handleFile(e.dataTransfer.files[0]); }}
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
        {cv.length === 0 ? (
          <EmptyState title="Chưa có CV nào" description="Tải lên CV đầu tiên để bắt đầu ứng tuyển." icon="📄" />
        ) : (
          <ul className="divide-y divide-navy-50">
           {cv.map((cv) => (
  <li key={cv.cvId} className="flex items-center justify-between py-3"> {/* Dùng cv.cvId làm key */}
    <div className="flex items-center gap-3">
      <span className="text-xl">📄</span>
      <div>
        <p className="text-sm font-medium text-ink">{cv.fileName}</p>
        <p className="text-xs text-gray-400">
          {/* Định dạng lại ngày tháng cho đẹp nếu cần */}
          Tải lên {new Date(cv.uploadedAt).toLocaleDateString()} 
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-3 text-sm">
      {jobId && (
        <button 
          onClick={() => handleApply(cv.cvId)} // Dùng cv.cvId
          className="bg-teal-600 text-white px-3 py-1.5 rounded-md font-semibold hover:bg-teal-700 transition"
        >
          Ứng tuyển
        </button>
      )}

      {/* Sửa link Xem và Tải xuống: dùng cv.cvId */}
      <a href={`http://localhost:5248/api/CV/download/${cv.cvId}`} target="_blank" rel="noopener noreferrer" className="text-navy-600 font-semibold hover:underline">Xem</a>
      <a href={`http://localhost:5248/api/CV/download/${cv.cvId}`} download className="text-navy-600 font-semibold hover:underline">Tải xuống</a>
      
      {/* Sửa nút Xóa */}
      <button onClick={() => setToDelete(cv.cvId)} className="text-coral-600 font-semibold hover:underline">Xóa</button>
    </div>
  </li>
))}
    </ul>
    )}</Card>

      {jobId && <Link to={`/candidate/jobs/${jobId}`}
       className="inline-block mt-4 text-sm text-teal-600 font-semibold hover:underline">
        ← Quay lại tin tuyển dụng
      </Link>}

      <DeleteDialog open={!!toDelete} onClose={() => setToDelete(null)} onConfirm={confirmDelete} message="Bạn có chắc muốn xóa CV này?" />
    </div>
  );
}
