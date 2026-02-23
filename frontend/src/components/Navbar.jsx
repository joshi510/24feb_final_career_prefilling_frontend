import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'COUNSELLOR':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'STUDENT':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center justify-center flex-shrink-0"
            >
              <div className="relative">
                <img 
                  src="/images/tops-logo.png" 
                  alt="TOPS TECHNOLOGIES Logo" 
                  className="h-10 sm:h-12 w-auto max-w-[200px] sm:max-w-[250px]"
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                {/* Overlay to hide the separator line */}
                <div 
                  className="absolute top-0 bottom-0 bg-white dark:bg-slate-800"
                  style={{ 
                    left: 'calc(50px + 2px)', 
                    width: '2px',
                    zIndex: 1
                  }}
                />
              </div>
              <div style={{ display: 'none' }} className="flex items-center gap-2.5 flex-shrink-0">
                {/* Fallback logo for Navbar */}
                <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 60 60" className="w-full h-full">
                    <path d="M30 10 L50 20 L50 40 L30 50 L10 40 L10 20 Z" fill="none" stroke="#60A5FA" strokeWidth="1.5"/>
                    <path d="M30 10 L50 20 L30 20" fill="none" stroke="#60A5FA" strokeWidth="1.5"/>
                    <path d="M50 20 L50 40 L30 50" fill="none" stroke="#60A5FA" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="flex-shrink-0 flex flex-col justify-center">
                  <div className="text-lg font-bold text-blue-400 leading-tight whitespace-nowrap">TOPS</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight whitespace-nowrap">TECHNOLOGIES</div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{user.full_name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                {/* Dark Mode Toggle */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors btn-hover"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle dark mode"
                >
                  {isDark ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors btn-hover"
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

