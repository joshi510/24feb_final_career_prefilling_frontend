import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, FlaskConical, Palette, Users, Megaphone, Folder, TrendingUp, Minus, TrendingDown } from 'lucide-react';

function RIASECDimensionCard({ dimension }) {
  if (!dimension) return null;

  const getDimensionColor = (code) => {
    const colors = {
      R: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
        badge: 'bg-orange-500',
        progress: 'bg-orange-500',
        Icon: Wrench
      },
      I: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-500',
        progress: 'bg-blue-500',
        Icon: FlaskConical
      },
      A: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
        badge: 'bg-purple-500',
        progress: 'bg-purple-500',
        Icon: Palette
      },
      S: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        badge: 'bg-green-500',
        progress: 'bg-green-500',
        Icon: Users
      },
      E: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-500',
        progress: 'bg-red-500',
        Icon: Megaphone
      },
      C: {
        bg: 'bg-slate-50 dark:bg-slate-800',
        border: 'border-slate-200 dark:border-slate-700',
        text: 'text-slate-700 dark:text-slate-300',
        badge: 'bg-slate-500',
        progress: 'bg-slate-500',
        Icon: Folder
      }
    };
    return colors[code] || colors.C;
  };

  // Deterministic match level calculation based on score
  const calculateMatchLevel = (score) => {
    if (score >= 30) return 'HIGH MATCH';
    if (score >= 15) return 'MODERATE MATCH';
    return 'LOW MATCH';
  };

  const getMatchLevelColor = (matchLevel) => {
    if (matchLevel === 'HIGH MATCH') {
      return {
        classes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
        Icon: TrendingUp
      };
    } else if (matchLevel === 'MODERATE MATCH') {
      return {
        classes: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        Icon: Minus
      };
    } else {
      return {
        classes: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
        Icon: TrendingDown
      };
    }
  };

  const colors = getDimensionColor(dimension.code);
  const score = Math.round(dimension.score || 0);
  const matchLevel = dimension.matchLevel || calculateMatchLevel(score);
  const matchLevelConfig = getMatchLevelColor(matchLevel);
  const MatchIcon = matchLevelConfig.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 mb-6`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <colors.Icon className="w-8 h-8 text-slate-700 dark:text-slate-300 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {dimension.title}
            </h3>
            {dimension.calculationInsight && (
              <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-1">
                Calculation Insight: {dimension.calculationInsight}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-semibold ${matchLevelConfig.classes}`}>
            <MatchIcon className="w-3.5 h-3.5" />
            {matchLevel}
          </div>
        </div>
      </div>

      {/* Match Threshold Rationale */}
      <div className="mb-3 -mt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          Rationale: Thresholds are intentionally calibrated for relative preference detection rather than psychometric percentile ranking. Scores reflect directional tendencies, not clinical intensity.
        </p>
      </div>

      {/* Tagline and Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            {dimension.tagline || `${dimension.title} tasks.`}
          </p>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {score}%
          </span>
        </div>
        {/* Normalization Explanation */}
        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
          Normalization Logic: The Likert scale (1–5) is linearly normalized to a 0–100 range using min-max scaling: Normalized Score = (value - minimum) / (maximum - minimum)
        </p>
        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`absolute left-0 top-0 h-full ${colors.progress}`}
          />
        </div>
      </div>

      {/* Personalized Analysis */}
      {dimension.personalizedAnalysis && (
        <div className={`${colors.border} border-l-4 pl-4 mb-4`}>
          <h4 className={`text-sm font-bold uppercase mb-2 ${colors.text}`}>
            PERSONALIZED ANALYSIS
          </h4>
          {typeof dimension.personalizedAnalysis === 'string' && dimension.personalizedAnalysis.includes('•') ? (
            <ul className="space-y-1">
              {dimension.personalizedAnalysis.split('•').filter(item => item.trim()).map((item, index) => (
                <li key={index} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{item.trim()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {dimension.personalizedAnalysis}
          </p>
          )}
        </div>
      )}

      {/* Core Strengths and Potential Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Core Strengths */}
        {dimension.coreStrengths && dimension.coreStrengths.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Core Strengths
            </h4>
            <ul className="space-y-1">
              {dimension.coreStrengths.map((strength, index) => (
                <li key={index} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Growth Areas */}
        {dimension.growthAreas && dimension.growthAreas.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Growth Areas
            </h4>
            <ul className="space-y-1">
              {dimension.growthAreas.map((area, index) => (
                <li key={index} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Work-Style Preferences */}
      {dimension.workStylePreferences && (
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Work-Style Preferences
          </h4>
          {typeof dimension.workStylePreferences === 'string' && dimension.workStylePreferences.includes('•') ? (
            <ul className="space-y-1">
              {dimension.workStylePreferences.split('•').filter(item => item.trim()).map((item, index) => (
                <li key={index} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{item.trim()}</span>
                </li>
              ))}
            </ul>
          ) : (
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            {dimension.workStylePreferences}
          </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default RIASECDimensionCard;

