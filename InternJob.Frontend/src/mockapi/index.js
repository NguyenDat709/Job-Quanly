// Mock REST API. Every function returns a Promise, exactly like a real
// axios call would, so swapping this file for real HTTP calls later
// requires zero changes in components/pages.

import * as db from "./storage";
import * as seed from "./seed";

const T = {
  users: "users",
  candidates: "candidate_profiles",
  employers: "employer_profiles",
  jobs: "jobs",
  categories: "categories",
  cvs: "cvs",
  applications: "applications",
  ai: "ai_history",
};

// ---------- AUTH ----------
export async function login(email, password) {
  await db.delay();
  const user = db.getAll(T.users, seed.USERS).find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Email hoặc mật khẩu không đúng.");
  const { password: _pw, ...safe } = user;
  return safe;
}

export async function register({ email, password, fullName, phone, role }) {
  await db.delay();
  const users = db.getAll(T.users, seed.USERS);
  if (users.some((u) => u.email === email)) throw new Error("Email đã được sử dụng.");
  const user = db.insert(T.users, seed.USERS, {
    email, password, fullName, phone, role, createdAt: new Date().toISOString().slice(0, 10),
  });
  if (role === "candidate") {
    db.insert(T.candidates, seed.CANDIDATE_PROFILES, { userId: user.id, avatar: "", skills: [], education: "", experience: "", cvIds: [] });
  } else if (role === "employer") {
    db.insert(T.employers, seed.EMPLOYER_PROFILES, { userId: user.id, logo: "", companyName: "", description: "", website: "" });
  }
  const { password: _pw, ...safe } = user;
  return safe;
}

export async function changePassword(userId, oldPassword, newPassword) {
  await db.delay();
  const user = db.getById(T.users, seed.USERS, userId);
  if (!user || user.password !== oldPassword) throw new Error("Mật khẩu cũ không đúng.");
  db.update(T.users, seed.USERS, userId, { password: newPassword });
  return true;
}

// ---------- CATEGORIES ----------
export async function getCategories() {
  await db.delay(150);
  return db.getAll(T.categories, seed.CATEGORIES);
}
export async function createCategory(data) {
  await db.delay();
  return db.insert(T.categories, seed.CATEGORIES, data);
}
export async function updateCategory(id, patch) {
  await db.delay();
  return db.update(T.categories, seed.CATEGORIES, id, patch);
}
export async function deleteCategory(id) {
  await db.delay();
  return db.remove(T.categories, seed.CATEGORIES, id);
}

// ---------- JOBS ----------
function withComputedStatus(job) {
  const isExpired = new Date(job.deadline) < new Date();
  return { ...job, status: isExpired ? "expired" : job.status === "closed" ? "closed" : "open" };
}

export async function getJobs(filters = {}) {
  await db.delay();
  let jobs = db.getAll(T.jobs, seed.JOBS).map(withComputedStatus);
  const { keyword, location, categoryId, employerId, status } = filters;
  if (keyword) {
    const k = keyword.toLowerCase();
    jobs = jobs.filter((j) => j.title.toLowerCase().includes(k) || j.description.toLowerCase().includes(k));
  }
  if (location) jobs = jobs.filter((j) => j.location === location);
  if (categoryId) jobs = jobs.filter((j) => j.categoryId === categoryId);
  if (employerId) jobs = jobs.filter((j) => j.employerId === employerId);
  if (status) jobs = jobs.filter((j) => j.status === status);
  return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getJob(id) {
  await db.delay(200);
  const job = db.getById(T.jobs, seed.JOBS, id);
  return job ? withComputedStatus(job) : null;
}

export async function createJob(data, employerId) {
  await db.delay();
  return db.insert(T.jobs, seed.JOBS, {
    ...data, employerId, status: "open", createdAt: new Date().toISOString().slice(0, 10),
  });
}
export async function updateJob(id, patch) {
  await db.delay();
  return db.update(T.jobs, seed.JOBS, id, patch);
}
export async function deleteJob(id) {
  await db.delay();
  return db.remove(T.jobs, seed.JOBS, id);
}

// ---------- CVS ----------
export async function getCandidateCVs(candidateId) {
  await db.delay(200);
  return db.getAll(T.cvs, seed.CVS).filter((c) => c.candidateId === candidateId);
}

export async function uploadCV(candidateId, file) {
  await db.delay(600);
  const ALLOWED = ["pdf", "docx"];
  const ext = file.name.split(".").pop().toLowerCase();
  if (!ALLOWED.includes(ext)) throw new Error("Chỉ cho phép upload tệp PDF hoặc DOCX.");
  const cv = db.insert(T.cvs, seed.CVS, {
    candidateId, fileName: file.name, uploadedAt: new Date().toISOString().slice(0, 10), sizeKb: Math.round(file.size / 1024),
  });
  const profile = db.getById(T.candidates, seed.CANDIDATE_PROFILES, candidateId);
  if (profile) db.update(T.candidates, seed.CANDIDATE_PROFILES, candidateId, { cvIds: [...profile.cvIds, cv.id] });
  return cv;
}

export async function deleteCV(id) {
  await db.delay();
  return db.remove(T.cvs, seed.CVS, id);
}

// ---------- PROFILES ----------
export async function getCandidateProfile(userId) {
  await db.delay(200);
  return db.getById(T.candidates, seed.CANDIDATE_PROFILES, userId) || { userId, avatar: "", skills: [], education: "", experience: "", cvIds: [] };
}
export async function updateCandidateProfile(userId, patch) {
  await db.delay();
  return db.update(T.candidates, seed.CANDIDATE_PROFILES, userId, patch);
}
export async function getEmployerProfile(userId) {
  await db.delay(200);
  return db.getById(T.employers, seed.EMPLOYER_PROFILES, userId) || { userId, logo: "", companyName: "", description: "", website: "" };
}
export async function updateEmployerProfile(userId, patch) {
  await db.delay();
  return db.update(T.employers, seed.EMPLOYER_PROFILES, userId, patch);
}
export async function updateUser(userId, patch) {
  await db.delay();
  const updated = db.update(T.users, seed.USERS, userId, patch);
  const { password: _pw, ...safe } = updated;
  return safe;
}

// ---------- APPLICATIONS ----------
export async function getApplications(filters = {}) {
  await db.delay();
  let apps = db.getAll(T.applications, seed.APPLICATIONS);
  const { candidateId, jobId, employerId } = filters;
  if (candidateId) apps = apps.filter((a) => a.candidateId === candidateId);
  if (jobId) apps = apps.filter((a) => a.jobId === jobId);
  if (employerId) {
    const jobIds = db.getAll(T.jobs, seed.JOBS).filter((j) => j.employerId === employerId).map((j) => j.id);
    apps = apps.filter((a) => jobIds.includes(a.jobId));
  }
  return apps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
}

export async function applyToJob({ jobId, candidateId, cvId }) {
  await db.delay(400);
  const job = db.getById(T.jobs, seed.JOBS, jobId);
  if (!job) throw new Error("Không tìm thấy tin tuyển dụng.");
  if (new Date(job.deadline) < new Date()) throw new Error("Tin tuyển dụng đã hết hạn.");
  const existing = db.getAll(T.applications, seed.APPLICATIONS)
    .find((a) => a.jobId === jobId && a.candidateId === candidateId && a.cvId === cvId);
  if (existing) throw new Error("Bạn đã ứng tuyển công việc này bằng CV này rồi.");
  return db.insert(T.applications, seed.APPLICATIONS, {
    jobId, candidateId, cvId, status: "reviewing", appliedAt: new Date().toISOString().slice(0, 10),
  });
}

export async function updateApplicationStatus(id, status) {
  await db.delay();
  return db.update(T.applications, seed.APPLICATIONS, id, { status });
}

// ---------- AI (mocked) ----------
export async function aiReviewCV({ candidateId, jobId }) {
  await db.delay(900);
  const score = 65 + Math.floor(Math.random() * 30);
  const result = `CV phù hợp khoảng ${score}% với vị trí ứng tuyển. Gợi ý: bổ sung số liệu cụ thể (KPI, quy mô dự án), làm rõ công nghệ sử dụng, và tinh gọn phần kinh nghiệm để nhà tuyển dụng nắm nhanh điểm mạnh.`;
  return db.insert(T.ai, seed.AI_HISTORY, { candidateId, jobId, type: "cv_review", result, createdAt: new Date().toISOString().slice(0, 10) });
}

export async function aiGenerateInterviewQuestions({ candidateId, jobId }) {
  await db.delay(900);
  const result = [
    "Bạn hãy giới thiệu ngắn gọn về kinh nghiệm liên quan đến vị trí này?",
    "Bạn từng gặp khó khăn gì trong dự án gần nhất và giải quyết ra sao?",
    "Vì sao bạn muốn ứng tuyển vào vị trí này?",
    "Bạn xử lý áp lực deadline như thế nào?",
  ].join("\n");
  return db.insert(T.ai, seed.AI_HISTORY, { candidateId, jobId, type: "interview_questions", result, createdAt: new Date().toISOString().slice(0, 10) });
}

export async function getAIHistory(candidateId) {
  await db.delay(200);
  return db.getAll(T.ai, seed.AI_HISTORY).filter((a) => a.candidateId === candidateId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ---------- ADMIN ----------
export async function getUsers(filters = {}) {
  await db.delay();
  let users = db.getAll(T.users, seed.USERS).map(({ password: _pw, ...u }) => u);
  if (filters.role) users = users.filter((u) => u.role === filters.role);
  return users;
}
export async function deleteUser(id) {
  await db.delay();
  return db.remove(T.users, seed.USERS, id);
}
export async function updateUserRole(id, role) {
  await db.delay();
  return db.update(T.users, seed.USERS, id, { role });
}

export async function getAdminStats() {
  await db.delay();
  const users = db.getAll(T.users, seed.USERS);
  const jobs = db.getAll(T.jobs, seed.JOBS).map(withComputedStatus);
  const apps = db.getAll(T.applications, seed.APPLICATIONS);
  const ai = db.getAll(T.ai, seed.AI_HISTORY);
  return {
    totalUsers: users.length,
    totalCandidates: users.filter((u) => u.role === "candidate").length,
    totalEmployers: users.filter((u) => u.role === "employer").length,
    totalJobs: jobs.length,
    openJobs: jobs.filter((j) => j.status === "open").length,
    totalApplications: apps.length,
    aiUsageCount: ai.length,
    userGrowth: buildGrowthSeries(users, "createdAt"),
    jobGrowth: buildGrowthSeries(jobs, "createdAt"),
  };
}

function buildGrowthSeries(rows, dateField) {
  const byMonth = {};
  rows.forEach((r) => {
    const m = (r[dateField] || "").slice(0, 7);
    if (!m) return;
    byMonth[m] = (byMonth[m] || 0) + 1;
  });
  return Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }));
}
