import TeacherLayout from "../layouts/TeacherLayout";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";

import RoleProtectedRoute from "../components/RoleProtectedRoute";
export default {
  path: "/teacher",
  element: (
    <RoleProtectedRoute allowedRoles={["TEACHER"]}>
      <TeacherLayout />
    </RoleProtectedRoute>
  ),
  children: [{ path: "dashboard", element: <TeacherDashboard /> }],
};
