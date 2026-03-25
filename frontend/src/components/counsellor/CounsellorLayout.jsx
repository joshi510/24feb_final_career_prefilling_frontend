import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Footer from '../Footer';

const sidebarItems = [
  { path: '/counsellor', label: 'Dashboard', icon: 'dashboard' },
  { path: '/counsellor/appointments', label: 'Appointments', icon: 'calendar' },
];

// SVG Icon Components - Modern SaaS Style (same as AdminLayout)
const IconDashboard = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <rect x="6" y="12" width="1.5" height="6" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <rect x="8.5" y="9" width="1.5" height="9" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <rect x="15" y="11" width="1.5" height="7" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <rect x="17.5" y="8" width="1.5" height="10" rx="0.75" fill="currentColor" fillOpacity="0.6" />
    <path d="M6 6 L8 7 L10 5.5 L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="4" y="5" width="16" height="4" rx="2.5" fill="currentColor" fillOpacity="0.12" />
    <circle cx="6.5" cy="5" r="0.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="17.5" cy="5" r="0.8" fill="currentColor" fillOpacity="0.3" />
    <line x1="8.5" y1="9" x2="8.5" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="12" y1="9" x2="12" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="15.5" y1="9" x2="15.5" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="4" y1="12.5" x2="20" y2="12.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
    <circle cx="17" cy="16" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15.8 16 L16.5 16.7 L18.2 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

const IconChevronDown = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const IconLogout = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const getIcon = (iconName, className) => {
  const icons = {
    dashboard: <IconDashboard className={className} />,
    calendar: <IconCalendar className={className} />,
  };
  return icons[iconName] || <IconDashboard className={className} />;
};

function CounsellorLayout({ children }) {
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
    if (path === '/counsellor') {
      return location.pathname === '/counsellor';
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    if (location.pathname === '/counsellor') return 'Dashboard';
    if (location.pathname.startsWith('/counsellor/appointments')) return 'Appointments';
    return 'Counsellor Panel';
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
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`flex-shrink-0 ${active ? 'text-purple-600 dark:text-purple-400' : ''}`}>
                    {getIcon(item.icon, 'w-5 h-5')}
                  </span>
                  <span className="truncate">
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"
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
                COUNSELLOR
              </span>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px]"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                    {user?.full_name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <IconChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400 hidden sm:block" />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user?.full_name || 'Counsellor'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 min-h-[40px] text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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

export default CounsellorLayout;

