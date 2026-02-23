import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use requestIdleCallback or setTimeout to avoid blocking initial render
    const initAuth = () => {
      try {
    const storedUser = authService.getUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
    }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
    setLoading(false);
      }
    };

    // Use setTimeout to defer auth check and allow initial render
    const timer = setTimeout(initAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, firstName, lastName, contactNumber, parentContactNumber, schoolInstituteName, currentEducation, stream, familyAnnualIncome) => {
    const data = await authService.register(email, password, firstName, lastName, contactNumber, parentContactNumber, schoolInstituteName, currentEducation, stream, familyAnnualIncome);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

