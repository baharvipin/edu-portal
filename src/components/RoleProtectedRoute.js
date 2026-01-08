import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect user to their dashboard
    if (userRole === "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }
    if (userRole === "SUPER_ADMIN") {
      return <Navigate to="/superadmin/profile" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
