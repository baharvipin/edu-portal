import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LoginPage = lazy(() => import('../login/LoginPage'));
const RegistrationPage = lazy(() => import('../registration/RegistrationPage'));
const SchoolProfilePage = lazy(() => import('../registration/SchoolProfilePage'));
const DashboardPage = lazy(() => import('../dashboard/DashboardPage'));
const NoPageFound = lazy(() => import('../noPageFound/NoPageFound'));

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

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (profileCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchoolProfilePage />
    </Suspense>
  );
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
        path="/school/profile"
        element={<ProfileRoute />}
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


