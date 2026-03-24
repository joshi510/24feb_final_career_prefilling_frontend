import React from 'react';
import PathwayBlock from './PathwayBlock.jsx';

function CareerCard({ title, scorePercent, explanation, pathwaySections }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="rounded-xl border border-white/70 dark:border-slate-700 bg-white/85 dark:bg-slate-800/70 backdrop-blur-sm p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          {scorePercent != null ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shrink-0">
              {scorePercent}%
            </span>
          ) : null}
        </div>
        {explanation ? (
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">{explanation}</p>
        ) : null}
        <PathwayBlock sections={pathwaySections} />
      </div>
    </div>
  );
}

export default CareerCard;
