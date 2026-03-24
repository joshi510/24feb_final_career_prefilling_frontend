import React from 'react';

const FIT_BADGE = {
  HIGH: 'Great Fit',
  MODERATE: 'Good Fit',
  LOW: 'Explore'
};

const COLOR_BY_CODE = {
  R: 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200',
  I: 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200',
  A: 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200',
  S: 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200',
  E: 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200',
  C: 'border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200'
};

function RIASECCard({ icon, code, name, score, fitLevel }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className={`rounded-2xl border p-4 backdrop-blur-sm ${COLOR_BY_CODE[code] || COLOR_BY_CODE.C}`}>
        <div className="flex items-center justify-between">
          <span className="text-xl">{icon}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {FIT_BADGE[fitLevel] || FIT_BADGE.MODERATE}
          </span>
        </div>
        <p className="mt-2 text-sm font-bold">{name}</p>
        <p className="text-xl font-black mt-1">{score}%</p>
      </div>
    </div>
  );
}

export default RIASECCard;
