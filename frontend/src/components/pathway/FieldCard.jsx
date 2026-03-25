import React from 'react';
import CareerCard from './CareerCard.jsx';
import {
  Briefcase,
  ClipboardText,
  Flask,
  Palette,
  Users,
  Wrench
} from '@phosphor-icons/react';

const ORIENTATION_BY_RIASEC = {
  R: { emoji: '🛠️', label: 'Hands-on & practical', Icon: Wrench },
  I: { emoji: '🔬', label: 'Analysis & inquiry', Icon: Flask },
  A: { emoji: '🎨', label: 'Creative & expressive', Icon: Palette },
  S: { emoji: '🤝', label: 'Helping & people-focused', Icon: Users },
  E: { emoji: '💼', label: 'Leadership & influence', Icon: Briefcase },
  C: { emoji: '📐', label: 'Structured & detail-focused', Icon: ClipboardText }
};

function FieldCard({ riasecCode, fieldName, fieldExplanation, careers = [], fieldIndex }) {
  const meta = ORIENTATION_BY_RIASEC[String(riasecCode || '').toUpperCase()];
  const PIcon = meta?.Icon;
  const fieldHeading =
    fieldIndex != null && fieldIndex > 0 ? (
      <>
        <span className="tabular-nums text-indigo-600 dark:text-indigo-400">{fieldIndex}.</span>{' '}
        <span>{fieldName}</span>
      </>
    ) : (
      fieldName
    );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <div className="rounded-2xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-800/65 backdrop-blur-md p-3">
        <div className="space-y-1">
          <h5 className="text-base sm:text-[17px] font-bold leading-snug text-slate-900 dark:text-slate-100">
            {fieldHeading}
          </h5>
          {meta && PIcon ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-[15px] font-semibold leading-snug text-slate-600 dark:text-slate-300">
              <span className="text-[1.35rem] leading-none sm:text-2xl" aria-hidden>
                {meta.emoji}
              </span>
              <PIcon
                size={24}
                weight="duotone"
                className="shrink-0 text-indigo-600 dark:text-indigo-400"
                aria-hidden
              />
              <span>{meta.label}</span>
            </div>
          ) : null}
        </div>
        {fieldExplanation ? (
          <p className="mt-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{fieldExplanation}</p>
        ) : null}
        <div className="mt-2 space-y-2">
          {careers.map((career, idx) => (
            <CareerCard
              key={`${career.title}-${idx}`}
              careerIndex={idx + 1}
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
