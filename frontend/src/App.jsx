import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all heavy components for better performance
const Login = lazy(() => import('./pages/Login'));
const StudentDashboard = lazy(() => import('./pages/dashboards/StudentDashboard'));
const CounsellorDashboard = lazy(() => import('./pages/dashboards/CounsellorDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'));
const StudentsList = lazy(() => import('./pages/admin/StudentsList'));
const AdminStudentResult = lazy(() => import('./pages/admin/StudentResult'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const QuestionsList = lazy(() => import('./pages/admin/QuestionsList'));
const QuestionForm = lazy(() => import('./pages/admin/QuestionForm'));
const AddCounsellor = lazy(() => import('./pages/admin/AddCounsellor'));
const CounselorsList = lazy(() => import('./pages/admin/CounselorsList'));
const ResultPage = lazy(() => import('./pages/ResultPage'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

// Create a QueryClient instance with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on reconnect
      retry: 1, // Retry failed requests once
      retryDelay: 1000, // Wait 1 second before retry
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
              {/* Root path shows registration for students */}
              <Route path="/" element={<Login />} />
              {/* Student registration */}
              <Route path="/register" element={<Login />} />
              {/* Admin login */}
              <Route path="/admin/login" element={<Login />} />
              {/* Counsellor login */}
              <Route path="/counsellor/login" element={<Login />} />
              {/* General login (for already logged in users or direct access) */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/result/:attemptId"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'COUNSELLOR']}>
                    <ResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/counsellor"
                element={
                  <ProtectedRoute allowedRoles={['COUNSELLOR']}>
                    <CounsellorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <StudentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students/:studentId/result/:resultId"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminStudentResult />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/questions"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <QuestionsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/questions/new"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <QuestionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/questions/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <QuestionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/counsellors/add"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AddCounsellor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/counselors"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CounselorsList />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

