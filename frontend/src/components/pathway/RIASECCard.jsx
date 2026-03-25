import React from 'react';
import { FlaskConical, Folder, Megaphone, Palette, Users, Wrench } from 'lucide-react';

/** Same wording as pathway field cards (orientation line) */
const SUBTITLE_BY_CODE = {
  R: 'Hands-on & practical',
  I: 'Analysis & inquiry',
  A: 'Creative & expressive',
  S: 'Helping & people-focused',
  E: 'Leadership & influence',
  C: 'Structured & detail-focused'
};

const THEME_BY_CODE = {
  R: {
    Icon: Wrench,
    iconTile: 'bg-red-500 shadow-sm shadow-red-500/25',
    border: 'border-red-200 dark:border-red-800/60',
    surface: 'bg-red-50/90 dark:bg-red-950/25',
    title: 'text-red-700 dark:text-red-300',
    subtitle: 'text-red-900/55 dark:text-red-200/70',
    progressTrack: 'bg-red-100/90 dark:bg-red-950/40',
    progressFill: 'bg-red-500 dark:bg-red-400'
  },
  I: {
    Icon: FlaskConical,
    iconTile: 'bg-blue-500 shadow-sm shadow-blue-500/25',
    border: 'border-blue-200 dark:border-blue-800/60',
    surface: 'bg-blue-50/90 dark:bg-blue-950/25',
    title: 'text-blue-700 dark:text-blue-300',
    subtitle: 'text-blue-900/55 dark:text-blue-200/70',
    progressTrack: 'bg-blue-100/90 dark:bg-blue-950/40',
    progressFill: 'bg-blue-500 dark:bg-blue-400'
  },
  A: {
    Icon: Palette,
    iconTile: 'bg-purple-500 shadow-sm shadow-purple-500/25',
    border: 'border-purple-200 dark:border-purple-800/60',
    surface: 'bg-purple-50/90 dark:bg-purple-950/25',
    title: 'text-purple-700 dark:text-purple-300',
    subtitle: 'text-purple-900/55 dark:text-purple-200/70',
    progressTrack: 'bg-purple-100/90 dark:bg-purple-950/40',
    progressFill: 'bg-purple-500 dark:bg-purple-400'
  },
  S: {
    Icon: Users,
    iconTile: 'bg-emerald-500 shadow-sm shadow-emerald-500/25',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    surface: 'bg-emerald-50/90 dark:bg-emerald-950/25',
    title: 'text-emerald-700 dark:text-emerald-300',
    subtitle: 'text-emerald-900/55 dark:text-emerald-200/70',
    progressTrack: 'bg-emerald-100/90 dark:bg-emerald-950/40',
    progressFill: 'bg-emerald-500 dark:bg-emerald-400'
  },
  E: {
    Icon: Megaphone,
    iconTile: 'bg-orange-500 shadow-sm shadow-orange-500/25',
    border: 'border-orange-200 dark:border-orange-800/60',
    surface: 'bg-orange-50/90 dark:bg-orange-950/25',
    title: 'text-orange-700 dark:text-orange-300',
    subtitle: 'text-orange-900/55 dark:text-orange-200/70',
    progressTrack: 'bg-orange-100/90 dark:bg-orange-950/40',
    progressFill: 'bg-orange-500 dark:bg-orange-400'
  },
  C: {
    Icon: Folder,
    iconTile: 'bg-slate-600 shadow-sm shadow-slate-600/25 dark:bg-slate-500',
    border: 'border-slate-300 dark:border-slate-600',
    surface: 'bg-slate-50/95 dark:bg-slate-900/40',
    title: 'text-slate-800 dark:text-slate-200',
    subtitle: 'text-slate-600 dark:text-slate-400',
    progressTrack: 'bg-slate-200/90 dark:bg-slate-800/80',
    progressFill: 'bg-slate-600 dark:bg-slate-500'
  }
};

function RIASECCard({ code, name, score, showTopBadge = true }) {
  const theme = THEME_BY_CODE[code] || THEME_BY_CODE.C;
  const Icon = theme.Icon;
  const pct = Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
  const subtitle = SUBTITLE_BY_CODE[code] || SUBTITLE_BY_CODE.C;

  return (
    <div
      className={`rounded-2xl border-2 ${theme.border} ${theme.surface} p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.iconTile}`}
            aria-hidden
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className={`text-sm font-bold leading-tight ${theme.title}`}>
              <span className="text-base font-black tabular-nums">{code}</span>
              <span className="mx-1.5 font-normal opacity-40 dark:opacity-50" aria-hidden>
                ·
              </span>
              <span>{name}</span>
            </p>
            <p className={`mt-0.5 text-[11px] font-medium leading-snug sm:text-xs ${theme.subtitle}`}>{subtitle}</p>
          </div>
        </div>
        {showTopBadge ? (
          <span className="shrink-0 rounded-full border border-slate-200/90 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 shadow-sm dark:border-slate-600 dark:bg-slate-900/85 dark:text-slate-300">
            Great Fit
          </span>
        ) : null}
      </div>

      <p className={`mt-4 text-3xl font-black tabular-nums tracking-tight ${theme.title}`}>{pct}%</p>

      <div className={`mt-3 h-2.5 w-full overflow-hidden rounded-full ${theme.progressTrack}`}>
        <div
          className={`h-full rounded-full ${theme.progressFill} transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default RIASECCard;
