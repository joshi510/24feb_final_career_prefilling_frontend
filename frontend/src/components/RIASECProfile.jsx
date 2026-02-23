import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Brain, FlaskConical, Lightbulb, Rocket, Wrench, Palette, Users, Megaphone, Folder, Sparkles } from 'lucide-react';

function RIASECProfile({ riasecReport }) {
  if (!riasecReport || !riasecReport.riasecProfile) {
    return null;
  }

  const { decisionRisk, topQualities, topTraits } = riasecReport.riasecProfile;

  const getRiskColor = (level) => {
    if (level === 'Low Risk') {
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-500',
        progress: 'bg-green-500'
      };
    } else if (level === 'Moderate Risk') {
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        badge: 'bg-amber-500',
        progress: 'bg-amber-500'
      };
    } else {
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        badge: 'bg-red-500',
        progress: 'bg-red-500'
      };
    }
  };

  const getStabilityProgress = (stability) => {
    if (stability === 'Highly Stable') return 100;
    if (stability === 'Moderately Stable') return 66;
    return 33;
  };

  const getTraitColor = (code) => {
    const colors = {
      R: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700', icon: 'bg-orange-500' },
      I: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', icon: 'bg-blue-500' },
      A: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700', icon: 'bg-purple-500' },
      S: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700', icon: 'bg-green-500' },
      E: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700', icon: 'bg-red-500' },
      C: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600', icon: 'bg-slate-500' }
    };
    return colors[code] || colors.C;
  };

  const getTraitIcon = (code) => {
    const icons = {
      R: Wrench,
      I: FlaskConical,
      A: Palette,
      S: Users,
      E: Megaphone,
      C: Folder
    };
    return icons[code] || Sparkles;
  };

  const riskColors = getRiskColor(decisionRisk?.level || 'Moderate Risk');
  const stabilityProgress = getStabilityProgress(decisionRisk?.stability || 'Moderately Stable');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Your RIASEC Profile
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Visualizing your unique blend of vocational interests and strengths.
          </p>
        </div>
      </div>

      {/* Decision Risk and Top Qualities - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decision Risk */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${riskColors.bg} ${riskColors.border} border rounded-xl p-6`}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-slate-700 dark:text-slate-300 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                DECISION RISK
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Profile Consistency Check.
              </p>
            </div>
          </div>
          
          {/* Decision Risk Disclaimer */}
          <div className="mb-3 -mt-1">
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              Important: Decision Risk is a score dispersion indicator and does not represent psychological evaluation or diagnostic assessment.
            </p>
          </div>
          
          <div className="mb-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {decisionRisk?.level || 'Moderate Risk'}
            </div>
            
            {/* Stability Progress Bar */}
            <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full ${riskColors.progress} transition-all duration-1000`}
                style={{ width: `${stabilityProgress}%` }}
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className={`text-sm font-medium ${riskColors.text}`}>
                {decisionRisk?.stability || 'Moderately Stable'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Top Qualities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-slate-700 dark:text-slate-300 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                TOP QUALITIES
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Behavioral Strengths.
              </p>
            </div>
          </div>

          {topQualities && topQualities.length > 0 ? (
            <ul className="space-y-3">
              {topQualities.map((quality, index) => {
                const icons = [FlaskConical, Lightbulb, Rocket];
                const IconComponent = icons[index] || Sparkles;
                return (
                  <li key={index} className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {quality}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No qualities available
            </p>
          )}
        </motion.div>
      </div>

      {/* Top Traits */}
      {topTraits && topTraits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            TOP TRAITS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {topTraits.map((trait, index) => {
              const colors = getTraitColor(trait.code);
              return (
                <motion.div
                  key={trait.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`${colors.bg} ${colors.border} border rounded-full px-6 py-3 flex items-center gap-3 w-full`}
                >
                  {React.createElement(getTraitIcon(trait.code), { className: "w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" })}
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {trait.label}
                    </div>
                    <div className={`text-sm font-bold ${colors.text}`}>
                      {trait.score}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default RIASECProfile;

