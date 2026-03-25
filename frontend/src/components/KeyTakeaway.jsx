import React from 'react';
import { motion } from 'framer-motion';
import { keyTakeawayMessage } from '../utils/simplifiedReportCopy.js';

function KeyTakeaway({ readinessStatus, overallPercentage }) {
  const getTakeaway = () => keyTakeawayMessage(readinessStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 mb-8 shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
            {getTakeaway()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default KeyTakeaway;

