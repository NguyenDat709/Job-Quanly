import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import JobListPage from "./pages/public/JobListPage";
import JobDetailPage from "./pages/public/JobDetailPage";
import { NotFound, Forbidden, ServerError } from "./pages/public/StatusPages";

import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateJobList from "./pages/candidate/JobList";
import CandidateJobDetailPage from "./pages/candidate/JobDetailPage";
import UploadCV from "./pages/candidate/UploadCV";
import MyApplications from "./pages/candidate/MyApplications";
import AIHistory from "./pages/candidate/AIHistory";
import Profile from "./pages/candidate/Profile";
import ChangePassword from "./pages/candidate/ChangePassword";

import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerJobManage from "./pages/employer/JobManage";
import JobForm from "./pages/employer/JobForm";
import CandidateList from "./pages/employer/CandidateList";
import CompanyProfile from "./pages/employer/CompanyProfile";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUserManage from "./pages/admin/UserManage";
import AdminJobManage from "./pages/admin/JobManage";
import CategoryManage from "./pages/admin/CategoryManage";
import Reports from "./pages/admin/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public area */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/403" element={<Forbidden />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Candidate area */}
            <Route element={<ProtectedRoute roles={["candidate"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                <Route path="/candidate/jobs" element={<CandidateJobList />} />
                <Route path="/candidate/jobs/:id" element={<CandidateJobDetailPage />} />
                <Route path="/candidate/upload-cv" element={<UploadCV />} />
                <Route path="/candidate/applications" element={<MyApplications />} />
                <Route path="/candidate/ai-history" element={<AIHistory />} />
                <Route path="/candidate/profile" element={<Profile />} />
                <Route path="/candidate/change-password" element={<ChangePassword />} />
              </Route>
            </Route>

            {/* Employer area */}
            <Route element={<ProtectedRoute roles={["employer"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/jobs" element={<EmployerJobManage />} />
                <Route path="/employer/jobs/new" element={<JobForm />} />
                <Route path="/employer/jobs/:id/edit" element={<JobForm />} />
                <Route path="/employer/candidates" element={<CandidateList />} />
                <Route path="/employer/company" element={<CompanyProfile />} />
              </Route>
            </Route>

            {/* Admin area */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserManage />} />
                <Route path="/admin/jobs" element={<AdminJobManage />} />
                <Route path="/admin/categories" element={<CategoryManage />} />
                <Route path="/admin/reports" element={<Reports />} />
              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
