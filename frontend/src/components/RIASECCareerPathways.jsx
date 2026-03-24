import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Rocket, MessageCircle } from 'lucide-react';
import { getFieldRecommendations } from '../utils/careerEngine.js';
import { careerDatabase } from '../data/careerDatabase.js';
import { getCareerPathwayById, getVisiblePathwaySections } from '../data/careerPathways.js';
import {
  buildCounsellorReport,
  buildTopPathwayRowsForDisplay,
  generateStudentCareerDescription,
} from '../utils/reportEngine.js';
import { formatPathwayMatchStrength } from '../utils/simplifiedReportCopy.js';
import { getDimensionMatchLevel } from '../utils/riasecPresentation.js';
import RIASECCard from './pathway/RIASECCard.jsx';
import FieldCard from './pathway/FieldCard.jsx';

const RIASEC_LABELS = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

const RIASEC_ICON = {
  R: '🔧',
  I: '🔬',
  A: '🎨',
  S: '🤝',
  E: '🚀',
  C: '📋'
};

const ROW_ACCENT_BY_CODE = {
  R: 'bg-slate-50 text-slate-800',
  I: 'bg-slate-50 text-slate-800',
  A: 'bg-slate-50 text-slate-800',
  S: 'bg-slate-50 text-slate-800',
  E: 'bg-slate-50 text-slate-800',
  C: 'bg-slate-50 text-slate-800'
};

function normalizeKey(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/** @param {{ showDiscussionForCounsellor?: boolean, studentLevel?: "10th"|"12th"|"UG" }} props */
function RIASECCareerPathways({
  careerPathways: _careerPathways,
  dimensions,
  showDiscussionForCounsellor = false,
  studentLevel = '12th'
}) {
  const fieldAnalysis = useMemo(() => {
    if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) return null;
    return getFieldRecommendations(dimensions);
  }, [dimensions]);

  const report = useMemo(() => {
    if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) return null;
    return buildCounsellorReport(dimensions, fieldAnalysis);
  }, [dimensions, fieldAnalysis]);

  const rows = useMemo(() => {
    if (!fieldAnalysis?.pathwayRows?.length || !fieldAnalysis.state) return [];
    return buildTopPathwayRowsForDisplay(fieldAnalysis, { topRows: 3, topFields: 3, topCareers: 3 });
  }, [fieldAnalysis]);

  const careerIdByTitle = useMemo(() => {
    const map = new Map();
    for (const c of careerDatabase) map.set(normalizeKey(c.name), c.id);
    return map;
  }, []);

  const topTraits = useMemo(() => {
    if (!fieldAnalysis?.state?.raw) return [];
    return Object.entries(fieldAnalysis.state.raw)
      .map(([code, score]) => ({ code, score: Math.round(Number(score) || 0) }))
      .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.code.localeCompare(b.code)))
      .slice(0, 3);
  }, [fieldAnalysis]);

  const enrichedRows = useMemo(() => {
    return rows.map((row) => ({
      ...row,
      fields: (row.fields || []).map((field) => {
        const careers = (field.careers || []).map((c) => {
            const id = careerIdByTitle.get(normalizeKey(c.title));
            const pathway = getCareerPathwayById(id);
            return {
              ...c,
              explanation: generateStudentCareerDescription(c.title, fieldAnalysis?.state),
              pathwaySections: getVisiblePathwaySections(studentLevel, pathway)
            };
          });
        return { ...field, careers };
      })
    }));
  }, [rows, careerIdByTitle, fieldAnalysis, studentLevel]);

  if (!fieldAnalysis || fieldAnalysis.valid === false) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Career Recommendation System</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {fieldAnalysis?.confidenceMessage || 'RIASEC dimensions not available.'}
        </p>
      </div>
    );
  }

  const discussionPrompts = showDiscussionForCounsellor ? report?.discussionPrompts || [] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-md space-y-5"
    >
      <div className="flex items-center gap-3">
        <Rocket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Career Pathways</h3>
        </div>
      </div>

      <section>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">RIASEC Fit (Top 3)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topTraits.map((t) => (
            <RIASECCard
              key={t.code}
              icon={RIASEC_ICON[t.code]}
              code={t.code}
              name={RIASEC_LABELS[t.code]}
              score={t.score}
              fitLevel={getDimensionMatchLevel(t.score)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">TOP 3 CAREER PATHWAY</h4>
        {enrichedRows.map((row) => (
          <div
            key={row.riasecCode}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
          >
            <div className="rounded-2xl p-3">
              <div className="flex flex-col lg:flex-row gap-3">
              <div className={`lg:w-36 rounded-xl ${ROW_ACCENT_BY_CODE[row.riasecCode] || ROW_ACCENT_BY_CODE.C} dark:bg-slate-700 p-3 border border-slate-200 dark:border-slate-600 shadow-sm`}>
                <p className="text-2xl font-black">{row.riasecCode}</p>
                <p className="text-xs font-semibold opacity-95">{RIASEC_LABELS[row.riasecCode]}</p>
                <p className="text-[11px] mt-1 opacity-90">{getDimensionMatchLevel(row.riasecScore)} - {row.riasecScore}%</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {row.riasecCode} - All Career Pathway Options
                </p>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                  {(row.fields || []).slice(0, 3).map((field) => (
                    <FieldCard
                      key={`${row.riasecCode}-${field.aspiringField}`}
                      fieldName={field.aspiringField}
                      fieldExplanation={field.explanation}
                      careers={field.careers}
                    />
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        ))}
      </section>

      {discussionPrompts.length > 0 && (
        <section className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">Discussion Questions</h5>
          </div>
          <div className="space-y-2">
            {discussionPrompts.map((line, idx) => (
              <p key={idx} className="text-xs text-slate-700 dark:text-slate-300">
                {line}
              </p>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

export default RIASECCareerPathways;
