import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

const LoginPage = lazy(() => import("../login/LoginPage"));
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
const SchoolOverviewPage =lazy(() => import("../admin/SchoolOverviewPage"));

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
            <Suspense fallback={<div>Loading...</div>}>
              <SuperAdminDashboard />
            </Suspense>
          }
        />

        <Route path="/school/profile" element={<SchoolProfilePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <TeachersPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <SubjectsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <StudentsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <ClassWiseStudents />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route 
        path="/admin/:id"
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
            <SchoolOverviewPage />
            </Suspense>
          </ProtectedRoute>
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
