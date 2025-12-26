import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('../login/LoginPage'));
const RegistrationPage = lazy(() => import('../registration/RegistrationPage'));
const SchoolProfilePage = lazy(() => import('../registration/SchoolProfilePage'));
const DashboardPage = lazy(() => import('../dashboard/DashboardPage'));
const NoPageFound = lazy(() => import('../noPageFound/NoPageFound'));
const SuperAdminDashboard = lazy(() => import('../dashboard/SuperAdminDashboard'));

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProfileRoute() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
  const status = localStorage.getItem('status');
  const userRole = localStorage.getItem('userRole');
alert('userRole:'+userRole);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (userRole === 'SUPER_ADMIN') {
    return <Navigate to="/superadmin/profile" replace />;
  }
  if (userRole == 'ADMIN' && status === 'PROFILE_SUBMITTED') {
    return <Navigate to="/dashboard" replace />;
  }
    if (userRole == 'ADMIN' && status === 'PROFILE_INCOMPLETE') {
      return <Navigate to="/school/profile" replace />;
    }

  if (profileCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
 
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={(
          <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
          </Suspense>
        )}
      />
      <Route
        path="/register"
        element={(
          <Suspense fallback={<div>Loading...</div>}>
            <RegistrationPage />
          </Suspense>
        )}
      />
       <Route
        path="/superadmin/profile"
        element={
            <Suspense fallback={<div>Loading...</div>}>
                     <SuperAdminDashboard />
            </Suspense>
        
      }
      />

      <Route
        path="/school/profile"
        element={<SchoolProfilePage />}
      />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        )}
      />
      <Route
        path="*"
        element={(
          <Suspense fallback={<div>Loading...</div>}>
            <NoPageFound />
          </Suspense>
        )}
      />
    </Routes>
  );
}

export default AppRoutes;


