import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-3">
          {/* Company Info */}
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
            <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">TOPS TECHNOLOGIES</p>
            <p className="text-xs text-slate-500 dark:text-slate-500">Training | Outsourcing | Placement | Study Abroad</p>
          </div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center md:text-right">
            <p className="font-medium">© {currentYear} TOPS TECHNOLOGIES. All rights reserved.</p>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-500">Career Profiling System</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

