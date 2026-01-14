import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

const LoginPage = lazy(() => import("../login/LoginPage"));
const ChangePasswordPage = lazy(() => import("../login/ChangePasswordPage"));
const RegistrationPage = lazy(() => import("../registration/RegistrationPage"));
const SchoolProfilePage = lazy(
  () => import("../registration/SchoolProfilePage"),
);
const DashboardPage = lazy(() => import("../dashboard/DashboardPage"));
const NoPageFound = lazy(() => import("../noPageFound/NoPageFound"));
const SuperAdminDashboard = lazy(
  () => import("../dashboard/SuperAdminDashboard"),
);
const SuspendedAccount = lazy(() => import("../account/SuspendedAccount"));
const AccountDeactivated = lazy(() => import("../account/AccountDeactivated"));
const SchoolRejected = lazy(() => import("../account/SchoolRejected"));
const SchoolPendingApproval = lazy(
  () => import("../account/SchoolPendingApproval"),
);
const TeachersPage = lazy(() => import("../admin/TeachersPage"));
const SubjectsPage = lazy(() => import("../admin/SubjectsPage"));
const StudentsPage = lazy(() => import("../admin/StudentsPage"));
const ClassWiseStudents = lazy(() => import("../admin/ClassWiseStudents"));
const SchoolOverviewPage = lazy(() => import("../admin/SchoolOverviewPage"));
const TeacherAssignments = lazy(
  () => import("../pages/teacher/TeacherAssignments"),
);

const TeacherDashboard = lazy(
  () => import("../pages/teacher/TeacherDashboard"),
);
const StudentDashboard = lazy(
  () => import("../pages/student/StudentDashboard"),
);
// const TeacherProfile = lazy(() => import("../pages/teacher/TeacherProfile"));
// const TeacherSubjects = lazy(() => import("../pages/teacher/TeacherSubjects"));
// const TeacherStudents = lazy(() => import("../pages/teacher/TeacherStudents"));

// legacy ProtectedRoute removed (unused)

// function ProfileRoute() {
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const profileCompleted = localStorage.getItem("profileCompleted") === "true";
//   const status = localStorage.getItem("status");
//   const userRole = localStorage.getItem("userRole");
//   alert("userRole:" + userRole);
//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }
//   if (userRole === "SUPER_ADMIN") {
//     return <Navigate to="/superadmin/profile" replace />;
//   }
//   if (userRole == "ADMIN" && status === "PROFILE_SUBMITTED") {
//     return <Navigate to="/dashboard" replace />;
//   }
//   if (userRole == "ADMIN" && status === "PROFILE_INCOMPLETE") {
//     return <Navigate to="/school/profile" replace />;
//   }

//   if (profileCompleted) {
//     return <Navigate to="/dashboard" replace />;
//   }
// }

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path="/change-password"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ChangePasswordPage />
          </Suspense>
        }
      />

      <Route
        path="/account/suspended"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <SuspendedAccount />
          </Suspense>
        }
      />
      <Route
        path="/account/deactivated"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <AccountDeactivated />
          </Suspense>
        }
      />
      <Route
        path="/school/rejected"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <SchoolRejected />
          </Suspense>
        }
      />
      <Route
        path="/school/pending-approval"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <SchoolPendingApproval />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <RegistrationPage />
          </Suspense>
        }
      />
      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route
          path="/superadmin/profile"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <SuperAdminDashboard />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers/assign"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <TeacherAssignments />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard/:teacherId"
          element={
            <RoleProtectedRoute allowedRoles={["TEACHER"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <TeacherDashboard />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard/:studentId"
          element={
            <RoleProtectedRoute allowedRoles={["STUDENT"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <StudentDashboard />
              </Suspense>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/school/profile"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <SchoolProfilePage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <TeachersPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <SubjectsPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <StudentsPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <ClassWiseStudents />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/superadmin/school/:id"
          element={
            <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <SchoolOverviewPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <NoPageFound />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
