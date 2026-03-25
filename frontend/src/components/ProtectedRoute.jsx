import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on allowed roles
    if (allowedRoles.includes('ADMIN')) {
      return <Navigate to="/admin/login" replace />;
    } else if (allowedRoles.includes('COUNSELLOR')) {
      return <Navigate to="/counsellor/login" replace />;
    } else {
      // For students, redirect to registration page
      return <Navigate to="/" replace />;
    }
  }

  if (allowedRoles.length > 0 && user) {
    // Normalize COUNSELOR (single L) to COUNSELLOR (double L) for role checking
    const userRole = user.role === 'COUNSELOR' ? 'COUNSELLOR' : user.role;
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate login page based on user role
      if (userRole === 'ADMIN') {
        return <Navigate to="/admin/login" replace />;
      } else if (userRole === 'COUNSELLOR') {
        return <Navigate to="/counsellor/login" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}

export default ProtectedRoute;
