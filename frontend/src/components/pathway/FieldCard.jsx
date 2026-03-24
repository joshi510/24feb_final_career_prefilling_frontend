import React from 'react';
import CareerCard from './CareerCard.jsx';

function FieldCard({ fieldName, fieldExplanation, careers = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="rounded-2xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-800/65 backdrop-blur-md p-3">
        <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{fieldName}</h5>
        {fieldExplanation ? (
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{fieldExplanation}</p>
        ) : null}
        <div className="mt-2 space-y-2">
          {careers.map((career) => (
            <CareerCard
              key={career.title}
              title={career.title}
              scorePercent={career.scorePercent}
              explanation={career.explanation}
              pathwaySections={career.pathwaySections}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FieldCard;
