// Seed data for the mock backend. All data lives in localStorage so the
// whole app runs without a real server. Replace src/mockapi/client.js with
// real axios/fetch calls later — every page only talks to mockapi/index.js,
// never to localStorage directly, so swapping the backend is a one-file change.

export const CATEGORIES = [
  { id: "c1", name: "Công nghệ thông tin", description: "Phát triển phần mềm, hệ thống, dữ liệu" },
  { id: "c2", name: "Kinh doanh / Bán hàng", description: "Sales, phát triển thị trường" },
  { id: "c3", name: "Marketing", description: "Digital marketing, thương hiệu, nội dung" },
  { id: "c4", name: "Tài chính / Kế toán", description: "Kế toán, kiểm toán, phân tích tài chính" },
  { id: "c5", name: "Nhân sự", description: "Tuyển dụng, C&B, đào tạo" },
  { id: "c6", name: "Thiết kế", description: "UI/UX, Graphic Design" },
];

export const USERS = [
  { id: "u1", email: "candidate@demo.vn", password: "123456", role: "candidate", fullName: "Nguyễn Văn An", phone: "0901234567", createdAt: "2026-01-10" },
  { id: "u2", email: "employer@demo.vn", password: "123456", role: "employer", fullName: "Trần Thị Bình", phone: "0902345678", createdAt: "2026-01-12" },
  { id: "u3", email: "admin@demo.vn", password: "123456", role: "admin", fullName: "Quản trị viên", phone: "0900000000", createdAt: "2026-01-01" },
  { id: "u4", email: "candidate2@demo.vn", password: "123456", role: "candidate", fullName: "Lê Thị Chi", phone: "0903456789", createdAt: "2026-02-01" },
];

export const CANDIDATE_PROFILES = [
  { userId: "u1", avatar: "", skills: ["React", "Node.js", "SQL"], education: "Đại học Bách Khoa Hà Nội - CNTT", experience: "2 năm Frontend Developer tại FPT Software", cvIds: ["cv1"] },
  { userId: "u4", avatar: "", skills: ["Java", "Spring Boot"], education: "Đại học Kinh tế Quốc dân", experience: "Fresher", cvIds: [] },
];

export const EMPLOYER_PROFILES = [
  { userId: "u2", logo: "", companyName: "Công ty TNHH Công nghệ ABC", description: "Công ty phát triển phần mềm hàng đầu Việt Nam", website: "https://abc-tech.vn" },
];

export const JOBS = [
  {
    id: "j1", employerId: "u2", title: "Frontend Developer (ReactJS)",
    description: "Phát triển giao diện web bằng ReactJS, phối hợp với team backend để hoàn thiện sản phẩm.",
    requirements: "2+ năm kinh nghiệm ReactJS, thành thạo HTML/CSS/JS, biết Git.",
    salaryMin: 18, salaryMax: 25, location: "Hà Nội", categoryId: "c1",
    deadline: "2026-08-15", status: "open", createdAt: "2026-06-01",
  },
  {
    id: "j2", employerId: "u2", title: "Backend Developer (Node.js)",
    description: "Xây dựng và tối ưu hệ thống API, làm việc với cơ sở dữ liệu quan hệ.",
    requirements: "Thành thạo Node.js/Express, MySQL hoặc PostgreSQL, RESTful API.",
    salaryMin: 20, salaryMax: 30, location: "Hồ Chí Minh", categoryId: "c1",
    deadline: "2026-07-20", status: "open", createdAt: "2026-06-05",
  },
  {
    id: "j3", employerId: "u2", title: "Chuyên viên Marketing Digital",
    description: "Lên kế hoạch và triển khai chiến dịch marketing đa kênh.",
    requirements: "1 năm kinh nghiệm Digital Marketing, biết chạy Ads, SEO cơ bản.",
    salaryMin: 12, salaryMax: 18, location: "Đà Nẵng", categoryId: "c3",
    deadline: "2026-07-01", status: "open", createdAt: "2026-05-20",
  },
  {
    id: "j4", employerId: "u2", title: "Nhân viên Kế toán tổng hợp",
    description: "Thực hiện các nghiệp vụ kế toán tổng hợp, báo cáo thuế.",
    requirements: "Tốt nghiệp Kế toán/Tài chính, thành thạo Excel, MISA.",
    salaryMin: 10, salaryMax: 15, location: "Hà Nội", categoryId: "c4",
    deadline: "2026-06-20", status: "expired", createdAt: "2026-04-01",
  },
  {
    id: "j5", employerId: "u2", title: "UI/UX Designer",
    description: "Thiết kế trải nghiệm và giao diện người dùng cho sản phẩm web/app.",
    requirements: "Thành thạo Figma, có portfolio, tư duy UX tốt.",
    salaryMin: 15, salaryMax: 22, location: "Hà Nội", categoryId: "c6",
    deadline: "2026-09-01", status: "open", createdAt: "2026-06-10",
  },
];

export const CVS = [
  { id: "cv1", candidateId: "u1", fileName: "CV_NguyenVanAn_Frontend.pdf", uploadedAt: "2026-06-01", sizeKb: 320 },
];

export const APPLICATIONS = [
  { id: "a1", jobId: "j1", candidateId: "u1", cvId: "cv1", status: "reviewing", appliedAt: "2026-06-15" },
  { id: "a2", jobId: "j5", candidateId: "u1", cvId: "cv1", status: "interview", appliedAt: "2026-06-18" },
];

export const AI_HISTORY = [
  { id: "ai1", candidateId: "u1", type: "cv_review", jobId: "j1", createdAt: "2026-06-15",
    result: "CV phù hợp 78% với vị trí. Nên bổ sung số liệu cụ thể về dự án đã làm và kỹ năng TypeScript." },
  { id: "ai2", candidateId: "u1", type: "interview_questions", jobId: "j1", createdAt: "2026-06-15",
    result: "1. Bạn hãy mô tả một dự án React phức tạp nhất bạn từng làm?\n2. Bạn xử lý state management như thế nào trong ứng dụng lớn?\n3. Sự khác biệt giữa useMemo và useCallback?" },
];
