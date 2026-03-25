import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Footer';

const sidebarItems = [
  { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { path: '/admin/students', label: 'Students', icon: 'users' },
  { path: '/admin/questions', label: 'Questions', icon: 'questions' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/admin/counselors', label: 'Counsellors', icon: 'add-user' },
  { path: '/admin/appointments', label: 'Appointments', icon: 'calendar' },
];

// SVG Icon Components - Modern SaaS Style
const IconDashboard = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    {/* Modern dashboard with grid layout and metrics */}
    <defs>
      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Grid background */}
    <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    {/* Chart bars - modern touch */}
    <rect x="6" y="12" width="1.5" height="6" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <rect x="8.5" y="9" width="1.5" height="9" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <rect x="15" y="11" width="1.5" height="7" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <rect x="17.5" y="8" width="1.5" height="10" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    {/* Trend line */}
    <path d="M6 6 L8 7 L10 5.5 L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const IconUsers = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    {/* Modern users icon with gradient and depth */}
    <defs>
      <linearGradient id="usersGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* User 1 - left */}
    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    <path d="M3 18 C3 15, 5 13, 8 13 C11 13, 13 15, 13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* User 2 - center */}
    <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    <path d="M7 18 C7 15, 9 13, 12 13 C15 13, 17 15, 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* User 3 - right with plus badge */}
    <circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    <path d="M11 18 C11 15, 13 13, 16 13 C19 13, 21 15, 21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Connection line - modern touch */}
    <line x1="10.5" y1="7" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="2 2" />
  </svg>
);

const IconAnalytics = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    {/* Modern analytics with bars and trend */}
    <defs>
      <linearGradient id="analyticsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Bar chart - left */}
    <rect x="4" y="16" width="3" height="4" rx="1.5" fill="currentColor" fillOpacity="0.6" />
    <rect x="8" y="12" width="3" height="8" rx="1.5" fill="currentColor" fillOpacity="0.6" />
    <rect x="12" y="14" width="3" height="6" rx="1.5" fill="currentColor" fillOpacity="0.6" />
    {/* Trend line chart - right */}
    <path d="M17 18 L18.5 15 L20 12 L21.5 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="17" cy="18" r="1.5" fill="currentColor" fillOpacity="0.8" />
    <circle cx="18.5" cy="15" r="1.5" fill="currentColor" fillOpacity="0.8" />
    <circle cx="20" cy="12" r="1.5" fill="currentColor" fillOpacity="0.8" />
    <circle cx="21.5" cy="8" r="1.5" fill="currentColor" fillOpacity="0.8" />
    {/* Grid lines */}
    <line x1="4" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="2 2" />
  </svg>
);

const IconMenu = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IconX = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconLogout = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconUser = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconFileText = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    {/* Modern document with lines and corner fold */}
    <defs>
      <linearGradient id="fileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {/* Document base */}
    <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
    {/* Corner fold - modern detail */}
    <path d="M15 4 L19 4 L19 8 L15 4 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <line x1="15" y1="4" x2="19" y2="8" stroke="currentColor" strokeWidth="1.5" />
    {/* Text lines */}
    <line x1="7" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="15" x2="13" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Question mark badge */}
    <circle cx="17" cy="7" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M17 6.5 L17 7.5 M17 9 L17 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconUserPlus = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    {/* Modern user with plus badge */}
    <defs>
      <linearGradient id="userPlusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    {/* User circle */}
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
    {/* User body */}
    <path d="M5 20 C5 16, 8 14, 12 14 C16 14, 19 16, 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Plus badge - modern touch */}
    <circle cx="17" cy="6" r="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
    <line x1="17" y1="4" x2="17" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="15" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    {/* Modern minimalist calendar with appointment badge - SaaS style */}
    {/* Calendar base with rounded corners */}
    <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Calendar top header */}
    <rect x="4" y="5" width="16" height="4" rx="2.5" fill="currentColor" fillOpacity="0.12" />
    {/* Spiral binding detail */}
    <circle cx="6.5" cy="5" r="0.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="17.5" cy="5" r="0.8" fill="currentColor" fillOpacity="0.3" />
    {/* Subtle grid lines */}
    <line x1="8.5" y1="9" x2="8.5" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="12" y1="9" x2="12" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="15.5" y1="9" x2="15.5" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="4" y1="12.5" x2="20" y2="12.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    {/* Modern appointment notification badge */}
    <circle cx="17" cy="16" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15.8 16 L16.5 16.7 L18.2 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const getIcon = (iconName, className) => {
  const icons = {
    dashboard: <IconDashboard className={className} />,
    users: <IconUsers className={className} />,
    questions: <IconFileText className={className} />,
    analytics: <IconAnalytics className={className} />,
    calendar: <IconCalendar className={className} />,
    'add-user': <IconUserPlus className={className} />,
  };
  return icons[iconName] || <IconDashboard className={className} />;
};

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setMobileSidebarOpen(false); // Always closed on mobile by default
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (mobileSidebarOpen && isMobile) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('aside') && !e.target.closest('button[aria-label="Toggle sidebar"]')) {
          setMobileSidebarOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileSidebarOpen, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard';
    if (location.pathname.startsWith('/admin/students')) {
      if (location.pathname.includes('/result')) return 'Student Result';
      return 'Students';
    }
    if (location.pathname === '/admin/analytics') return 'Analytics';
    return 'Admin Panel';
  };

  // Desktop: Always 256px, Mobile: 256px when open, 0 when closed
  const sidebarWidth = '256px';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar - Always visible on desktop, drawer on mobile */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (mobileSidebarOpen ? sidebarWidth : 0) : sidebarWidth,
          x: isMobile && !mobileSidebarOpen ? -sidebarWidth : 0
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 shadow-sm overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/images/tops-logo.png" 
                alt="TOPS TECHNOLOGIES Logo" 
                className="h-10 w-auto max-w-[180px]"
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            {/* Close button only on mobile */}
            {isMobile && mobileSidebarOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const active = isActive(item.path);
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                    {getIcon(item.icon, 'w-5 h-5')}
                  </span>
                  <span className="truncate">
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        className="transition-all duration-300"
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* Toggle button only on mobile */}
              {isMobile && (
                <motion.button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle sidebar"
                >
                  {mobileSidebarOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
                </motion.button>
              )}
              <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
                {getPageTitle()}
              </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Role Badge */}
              <span className="hidden sm:inline-flex px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                ADMIN
              </span>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                    {user?.full_name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <IconChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400 hidden sm:block" />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user?.full_name || 'Admin'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <IconLogout className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </main>

        <Footer />
      </div>

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminLayout;
