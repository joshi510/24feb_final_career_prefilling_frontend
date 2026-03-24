import React from 'react';

function PathwayBlock({ sections = [] }) {
  if (!sections.length) return null;

  return (
    <details className="mt-2 rounded-lg bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-2">
      <summary className="cursor-pointer text-[11px] font-bold text-slate-700 dark:text-slate-300">
        How to Reach
      </summary>
      <div className="mt-2 space-y-2">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{section.label}:</p>
            <ul className="mt-1 space-y-1">
              {section.items.map((item, idx) => (
                <li key={`${section.label}-${idx}`} className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

export default PathwayBlock;
