import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import AppLogo from './AppLogo';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center flex-shrink-0"
            >
              <AppLogo height={38} className="max-w-[180px] sm:max-w-[220px] sm:h-[44px]" />
            </motion.div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate max-w-[260px]">
                    {user.full_name}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors btn-hover"
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

