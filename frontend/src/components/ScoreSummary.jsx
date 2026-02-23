import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
                <div className="text-xs text-slate-500 dark:text-slate-400">Overall</div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="flex-1 order-2 md:order-none">
          <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Key Strengths
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
                    <span className="line-clamp-3">{strength}</span>
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
                    <span className="line-clamp-3">{weakness}</span>
                  </motion.li>
                ))
              ) : (
                <li className="text-sm text-slate-500 dark:text-slate-400 italic">No specific improvement areas identified yet</li>
              );
            })()}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreSummary;

