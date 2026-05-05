import { lazy, Suspense, type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress, CssBaseline } from '@mui/material'
import { AppThemeProvider } from './contexts/ThemeContext'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'
import ProfileLayout from './layouts/ProfileLayout'
import { useAuth } from './hooks/useAuth'
import { getDefaultRouteForRole } from './services/auth'

const LoginPage = lazy(() => import('./pages/public/LoginPage'))
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage'))
const OAuthCallbackPage = lazy(() => import('./pages/public/OAuthCallbackPage'))

const ChatPage = lazy(() => import('./pages/client/ChatPage'))
const DocumentsPage = lazy(() => import('./pages/client/DocumentsPage'))
const SessionsPage = lazy(() => import('./pages/client/SessionsPage'))
const MemoryPage = lazy(() => import('./pages/client/MemoryPage'))
const PersonalizationPage = lazy(() => import('./pages/client/PersonalizationPage'))
const ProfilePage = lazy(() => import('./pages/client/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/client/SettingsPage'))

const UsersPage = lazy(() => import('./pages/admin/UsersPage'))
const AgentsPage = lazy(() => import('./pages/admin/AgentsPage'))
const ProvidersPage = lazy(() => import('./pages/admin/ProvidersPage'))
const ConfigPage = lazy(() => import('./pages/admin/ConfigPage'))
const LogsPage = lazy(() => import('./pages/admin/LogsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function LoadingScreen() {
  return (
    <Box className="app-loading-screen">
      <CircularProgress color="primary" />
    </Box>
  )
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return children
}

function AdminRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/chat" replace />
  }

  return children
}

export default function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          <Route
            element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/personalization" element={<PersonalizationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route
            element={
          <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/agents" element={<AgentsPage />} />
            <Route path="/admin/providers" element={<ProvidersPage />} />
            <Route path="/admin/config" element={<ConfigPage />} />
            <Route path="/admin/logs" element={<LogsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppThemeProvider>
  )
}
