import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { simplifyReportText } from '../utils/simplifiedReportCopy.js';

function ScoreSummary({ interpretation }) {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (!interpretation || typeof interpretation.overall_percentage !== 'number') {
    console.error('Invalid interpretation data: missing overall_percentage');
    return null;
  }
  
  // IMPORTANT: Use overall_percentage directly from API response (backend scores table)
  // Do NOT recalculate - only round for display purposes
  const score = Math.round(interpretation.overall_percentage);
  
  if (score < 0 || score > 100) {
    console.error(`Invalid score value: ${score}. Must be between 0-100.`);
    return null;
  }
  const remaining = 100 - score;

  // Get section scores from interpretation
  const sectionScores = interpretation.section_scores || [];
  
  // Convert section scores to percentages
  // Backend returns raw score_value (1-5 scale average), need to convert to 0-100%
  const sectionScoresWithPercentages = sectionScores.map(section => {
    let percentage;
    // If score is already in 0-100 range, use it directly
    if (section.score >= 0 && section.score <= 100 && section.score > 5) {
      percentage = Math.round(section.score);
    } else {
      // Convert from 1-5 scale to 0-100%: ((score - 1) / 4) * 100
      percentage = Math.round(((section.score - 1) / 4) * 100);
    }
    return {
      ...section,
      percentage: Math.min(100, Math.max(0, percentage))
    };
  });

  const pieData = [
    { name: 'Score', value: score, fill: '#3b82f6' },
    { name: 'Remaining', value: remaining, fill: isDark ? '#334155' : '#e2e8f0' }
  ];

  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 card-hover transition-colors duration-300"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 sm:mb-6">Score Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Circular Progress */}
        <div className="flex flex-col items-center justify-center order-1 md:order-none">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto" style={{ minWidth: '128px', minHeight: '128px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    color: isDark ? '#f1f5f9' : '#1e293b'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{score}%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Overall Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="flex-1 order-2 md:order-none">
          <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Your Strengths
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 italic">You have a good base in some skills.</p>
          <ul className="space-y-2">
            {(() => {
              // Handle both array and string formats, with fallback to empty array
              let strengthsArray = [];
              if (interpretation.strengths) {
                if (Array.isArray(interpretation.strengths)) {
                  strengthsArray = interpretation.strengths;
                } else if (typeof interpretation.strengths === 'string') {
                  // Try to parse as JSON first, otherwise split by newlines
                  try {
                    const parsed = JSON.parse(interpretation.strengths);
                    strengthsArray = Array.isArray(parsed) ? parsed : [];
                  } catch {
                    // If not JSON, split by newlines and filter empty strings
                    strengthsArray = interpretation.strengths.split('\n').filter(s => s.trim());
                  }
                }
              }
              return strengthsArray.length > 0 ? (
                strengthsArray.slice(0, 3).map((strength, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start"
                  >
                    <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span className="line-clamp-3">{simplifyReportText(strength)}</span>
                  </motion.li>
                ))
              ) : (
                <li className="text-sm text-slate-500 dark:text-slate-400 italic">No specific strengths identified yet</li>
              );
            })()}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="flex-1 order-3 md:order-none">
          <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            Areas to Improve
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 italic">Some skills need more practice. This is normal.</p>
          <ul className="space-y-2">
            {(() => {
              // Handle both array and string formats, with fallback to empty array
              let weaknessesArray = [];
              if (interpretation.weaknesses || interpretation.areas_for_improvement) {
                const source = interpretation.weaknesses || interpretation.areas_for_improvement;
                if (Array.isArray(source)) {
                  weaknessesArray = source;
                } else if (typeof source === 'string') {
                  // Try to parse as JSON first, otherwise split by newlines
                  try {
                    const parsed = JSON.parse(source);
                    weaknessesArray = Array.isArray(parsed) ? parsed : [];
                  } catch {
                    // If not JSON, split by newlines and filter empty strings
                    weaknessesArray = source.split('\n').filter(s => s.trim());
                  }
                }
              }
              return weaknessesArray.length > 0 ? (
                weaknessesArray.slice(0, 3).map((weakness, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start"
                  >
                    <span className="text-amber-500 mr-2 mt-0.5 flex-shrink-0">•</span>
                    <span className="line-clamp-3">{simplifyReportText(weakness)}</span>
                  </motion.li>
                ))
              ) : (
                <li className="text-sm text-slate-500 dark:text-slate-400 italic">No specific improvement areas identified yet</li>
              );
            })()}
          </ul>
        </div>
      </div>

      {/* Section Scores Breakdown */}
      {sectionScoresWithPercentages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Your Scores
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {sectionScoresWithPercentages
              .filter((section, idx) => {
                const sectionNum = Number(section.section_number || section.sectionNumber || (idx + 1));
                return sectionNum >= 1 && sectionNum <= 4;
              })
              .map((section, idx) => (
              <motion.div
                key={section.section_number || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                    {(() => {
                      // Handle different possible field names and provide fallbacks
                      const sectionName = section.section_name || section.name;
                      const sectionNum = section.section_number || section.sectionNumber || (idx + 1);
                      
                      if (sectionName && sectionName !== 'undefined' && sectionName.trim() !== '') {
                        return sectionName;
                      }
                      
                      // Career Readiness labels for sections 1-4
                      if (sectionNum >= 1 && sectionNum <= 4) {
                        const careerLabels = {
                          1: 'Cognitive Reasoning',
                          2: 'Aptitude Test',
                          3: 'Study Habits',
                          4: 'Learning Style'
                        };
                        return careerLabels[sectionNum] || `Section ${sectionNum}`;
                      }
                      
                      return `Section ${sectionNum}`;
                    })()}
                  </div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={(section.section_number || section.sectionNumber || (idx + 1)) <= 4 
                          ? 'url(#careerGradient)' 
                          : 'url(#riasecGradient)'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - section.percentage / 100)}
                        className="transition-all duration-500"
                      />
                      <defs>
                        <linearGradient id="careerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient id="riasecGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                        {section.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Career
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ScoreSummary;

