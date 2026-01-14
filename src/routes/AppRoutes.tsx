import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from '@/features/auth';
import { ROUTES } from '@/utils/constants';

import LoginPage from '@/pages/LoginPage';
import HistoryPage from '@/pages/HistoryPage';
import StaffPage from '@/pages/StaffPage';
import ConversationPage from '@/pages/ConversationPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.HISTORY}
        element={
          <RequireAuth>
            <HistoryPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.STAFF}
        element={
          <RequireAuth>
            <StaffPage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.CONVERSATION}
        element={
          <RequireAuth>
            <ConversationPage />
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
      <Route path="/" element={<Navigate to={ROUTES.STAFF} replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
