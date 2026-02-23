import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function ResultHeader({ user, interpretation, onDownloadPDF, downloading }) {
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    if (!interpretation || typeof interpretation.overall_percentage !== 'number') {
      console.error('Invalid interpretation data: missing overall_percentage');
      return;
    }
    
    // IMPORTANT: Use overall_percentage directly from API response (backend scores table)
    // Do NOT recalculate - only round for display animation
    const targetScore = Math.round(interpretation.overall_percentage);
    
    if (targetScore < 0 || targetScore > 100) {
      console.error(`Invalid score value: ${targetScore}. Must be between 0-100.`);
      return;
    }
    
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [interpretation?.overall_percentage]);

  const getFriendlyReadinessLabel = (status) => {
    if (status === 'READY') return 'Ready for Career Planning';
    if (status === 'PARTIALLY READY') return 'Preparation Stage';
    return 'Exploration Stage';
  };

  const getFriendlyRiskLabel = (risk) => {
    if (risk === 'LOW') return 'Low Decision Risk';
    if (risk === 'MEDIUM') return 'Requires Guided Decision-Making';
    return 'Requires Guided Decision-Making';
  };

  const getBadgeColor = (status) => {
    if (status === 'READY' || status === 'LOW') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    if (status === 'PARTIALLY READY' || status === 'MEDIUM') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 mb-6 card-hover transition-colors duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">Test Status: Completed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 truncate" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            {user?.full_name || 'Student'}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getBadgeColor(interpretation.readiness_status)}`} title={interpretation.readiness_status}>
              <span className="hidden sm:inline">{getFriendlyReadinessLabel(interpretation.readiness_status)}</span>
              <span className="sm:hidden">{interpretation.readiness_status}</span>
            </div>
            <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getBadgeColor(interpretation.risk_level)}`} title={`Risk Level: ${interpretation.risk_level}`}>
              <span className="hidden sm:inline">{getFriendlyRiskLabel(interpretation.risk_level)}</span>
              <span className="sm:hidden">{interpretation.risk_level}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row items-center justify-center sm:flex-col lg:flex-row sm:items-center lg:items-center gap-4 sm:gap-5 lg:gap-6">
          <div className="flex flex-col items-center">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">Overall Score</p>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2
              }}
              className="relative flex items-center justify-center"
            >
              {/* Premium Outer Glow Effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 18px rgba(99,102,241,0.25), 0 0 35px rgba(59,130,246,0.1)',
                    '0 0 22px rgba(99,102,241,0.35), 0 0 40px rgba(59,130,246,0.15)',
                    '0 0 18px rgba(99,102,241,0.25), 0 0 35px rgba(59,130,246,0.1)',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  borderRadius: '50%',
                }}
              />
              
              {/* Circular Progress Ring with Premium Styling */}
              <svg 
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 transform -rotate-90 relative z-10" 
                viewBox="0 0 100 100"
                style={{
                  filter: 'drop-shadow(0 0 18px rgba(99,102,241,0.35)) drop-shadow(0 0 35px rgba(59,130,246,0.15))',
                }}
              >
                {/* Background Circle with Soft Edge */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(148,163,184,0.15)"
                  strokeWidth="8"
                  style={{
                    filter: 'blur(0.5px)',
                  }}
                />
                {/* Premium Progress Circle with Conic Gradient Effect */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#scoreGradientPremium)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  style={{
                    strokeDashoffset: 2 * Math.PI * 45 * (1 - score / 100),
                    transition: 'stroke-dashoffset 0.6s ease',
                    filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.4))',
                  }}
                />
                {/* Subtle Glow Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#scoreGradientGlow)"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 45}
                  style={{
                    strokeDashoffset: 2 * Math.PI * 45 * (1 - score / 100),
                    opacity: 0.5,
                    transition: 'stroke-dashoffset 0.6s ease, opacity 1.5s ease-in-out',
                  }}
                />
                {/* Premium Gradient Definitions */}
                <defs>
                  <linearGradient id="scoreGradientPremium" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.95)" />
                    <stop offset="50%" stopColor="rgba(59,130,246,0.85)" />
                    <stop offset="100%" stopColor="rgba(99,102,241,0.95)" />
                  </linearGradient>
                  <linearGradient id="scoreGradientGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.6)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0.6)" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Premium Inner Disc with Glass Panel Effect */}
              <div 
                className="absolute flex flex-col items-center justify-center z-10 rounded-full"
                style={{
                  width: 'calc(100% - 20px)',
                  height: 'calc(100% - 20px)',
                  margin: '10px',
                  background: 'radial-gradient(circle, rgba(30,41,59,0.9), rgba(15,23,42,0.95))',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.4)',
                  borderRadius: '50%',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {/* Score Text with Premium Styling */}
                <div 
                  className="flex flex-col items-center justify-center"
                >
                  <span 
                    className="text-xl sm:text-2xl lg:text-3xl font-semibold"
                    style={{
                      color: '#f8fafc',
                      fontWeight: 600,
                      letterSpacing: '0.3px',
                      textShadow: '0 0 12px rgba(99,102,241,0.6), 0 0 20px rgba(99,102,241,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      display: 'block',
                    }}
                  >
                    {score}
                  </span>
                  <span 
                    className="text-xs sm:text-sm font-medium -mt-1"
                    style={{
                      color: 'rgba(148,163,184,0.7)',
                      letterSpacing: '0.2px',
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.button
            onClick={onDownloadPDF}
            disabled={downloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:flex px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 btn-hover text-sm sm:text-base self-center mt-2 sm:mt-3"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="hidden lg:inline">Generating...</span>
                <span className="lg:hidden">Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden lg:inline">Download PDF Report</span>
                <span className="lg:hidden">Download PDF</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ResultHeader;

// Add CSS animations for the circular score
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 0.3;
      }
    }
    @keyframes progressGlow {
      0%, 100% {
        filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.5));
      }
      50% {
        filter: drop-shadow(0 0 12px rgba(37, 99, 235, 0.8));
      }
    }
  `;
  if (!document.head.querySelector('#circular-score-animations')) {
    style.id = 'circular-score-animations';
    document.head.appendChild(style);
  }
}

