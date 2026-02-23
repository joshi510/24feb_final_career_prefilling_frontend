import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-2">
          {/* Company Info */}
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
            <p className="font-medium">TOPS TECHNOLOGIES</p>
            <p className="text-xs mt-0.5">Training | Outsourcing | Placement | Study Abroad</p>
          </div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center md:text-right">
            <p>© {currentYear} TOPS TECHNOLOGIES. All rights reserved.</p>
            <p className="text-xs mt-0.5">Career Profiling System</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

