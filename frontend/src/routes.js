import { lazy } from 'react';

const Login = lazy(() => import('./pages/Login'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const CounsellorDashboard = lazy(() => import('./pages/CounsellorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

export const routes = [
  {
    path: '/login',
    component: Login,
    exact: true
  },
  {
    path: '/student',
    component: StudentDashboard,
    exact: true
  },
  {
    path: '/counsellor',
    component: CounsellorDashboard,
    exact: true
  },
  {
    path: '/admin',
    component: AdminDashboard,
    exact: true
  }
];

