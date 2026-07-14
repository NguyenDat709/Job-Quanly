import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Business rule: each area of the app belongs to exactly one role.
// A logged-in candidate hitting /employer/* (or vice-versa) sees 403, not a redirect loop.
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const isAllowed = roles && roles.some(role => role.toLowerCase() === user.role.toLowerCase());
  
  if (roles && !isAllowed) return <Navigate to="/403" replace />;
  console.log("User role:", user.role);
  console.log("Allowed roles:", roles);
  return <Outlet />;
}
