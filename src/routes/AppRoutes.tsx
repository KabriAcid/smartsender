import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from '@/features/auth';
import { ROUTES } from '@/utils/constants';

import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import FilesPage from '@/pages/FilesPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      
      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.FILES}
        element={
          <RequireAuth>
            <FilesPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
