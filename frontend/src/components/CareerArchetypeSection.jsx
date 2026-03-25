import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getFieldRecommendations } from '../utils/careerEngine.js';
import { resolveArchetypeDisplayName, getArchetypeTagline } from '../utils/reportEngine.js';

/**
 * Student-facing archetype banner (display layer). Uses same RIASEC dimensions as pathways.
 */
function CareerArchetypeSection({ dimensions }) {
  const archetype = useMemo(() => {
    if (!dimensions?.length) return null;
    const analysis = getFieldRecommendations(dimensions);
    if (!analysis?.valid || !analysis.state) return null;
    const displayName = resolveArchetypeDisplayName(analysis.state);
    return {
      displayName,
      tagline: getArchetypeTagline(displayName)
    };
  }, [dimensions]);

  if (!archetype) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border-2 border-indigo-200/80 dark:border-indigo-700/80 bg-gradient-to-br from-indigo-50 via-violet-50/80 to-purple-50 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-purple-950/30 p-6 sm:p-8 shadow-lg mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">Your Career Archetype</h2>
      </div>
      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent mb-4">
        {archetype.displayName}
      </p>
      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
        {archetype.tagline}
      </p>
    </motion.div>
  );
}

export default CareerArchetypeSection;
