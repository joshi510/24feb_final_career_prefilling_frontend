/**
 * Full student + counsellor report: profile, archetype, field + career recommendations, discussion prompts, confidence.
 */

import { RIASEC_CODES, getFieldWeightsRecord } from '../data/fieldsConfig.js';
import { getFieldRecommendations, resolveCareerRecordByTitle } from './careerEngine.js';
import { PATHWAY_OVERRIDE_CONFIG } from './pathwayOverrideConfig.js';

const RIASEC_LONG = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

/** Short student-facing line for named archetypes (display layer only) */
export const ARCHETYPE_DESCRIPTIONS = {
  'Technical Innovator':
    'You combine analytical thinking with hands-on problem solving. You build systems that work.',
  'Analytical Strategist': 'You love data, structure, and making sense of complexity. Detail is your superpower.',
  'Creative Thinker': 'You blend imagination with curiosity. You ask "why" and then make something new.',
  'People Scientist': 'You understand people deeply and use knowledge to help them grow.',
  'Entrepreneurial Analyst': 'You see opportunities in data and have the drive to act on them.',
  'Precision Executor': 'You value accuracy, structure, and doing things the right way every time.',
  'Action Leader': 'You lead from the front — decisive, practical, and results-driven.',
  'Structural Creator':
    'You combine creative vision with a hands-on approach. Beautiful and functional.',
  'Practical Helper': 'You care about people and express it through tangible, useful work.',
  'Empathetic Creator': 'You create things that connect with people emotionally and meaningfully.',
  'Creative Entrepreneur': 'You have bold ideas and the energy to make them real.',
  'Detail Artist': 'You bring precision and care to creative work — every detail matters.',
  'People Leader': 'You energise teams and bring out the best in the people around you.',
  'Supportive Organiser': 'You keep things running smoothly while genuinely caring about others.',
  'Strategic Planner': 'You think ahead, build structure, and execute with discipline.',
  'Versatile Professional': 'You bring a balanced mix of skills that adapts well across many fields.'
};

/** Ordered top-3 RIASEC keys (by normalized score, tie → letter) → display label */
const ARCHETYPE_BY_ORDERED_TOP3 = {
  'A-I-R': 'Structural Creator',
  'A-R-I': 'Structural Creator',
  'I-A-R': 'Structural Creator',
  'I-R-A': 'Structural Creator',
  'R-A-I': 'Structural Creator',
  'R-I-A': 'Structural Creator',
  'I-C-E': 'Analytical Strategist',
  'I-E-C': 'Entrepreneurial Analyst',
  'E-I-C': 'Entrepreneurial Analyst',
  'C-I-E': 'Strategic Planner',
  'S-I-E': 'People Scientist',
  'I-S-E': 'People Scientist',
  'E-S-I': 'People Leader',
  'S-E-I': 'People Leader',
  'A-I-S': 'Empathetic Creator',
  'I-A-S': 'Empathetic Creator',
  'A-E-I': 'Creative Entrepreneur',
  'E-A-I': 'Creative Entrepreneur',
  'R-I-C': 'Technical Innovator',
  'I-R-C': 'Technical Innovator',
  'C-R-I': 'Precision Executor',
  'R-C-I': 'Precision Executor',
  'A-C-I': 'Detail Artist',
  'C-A-I': 'Detail Artist',
  'S-C-E': 'Supportive Organiser',
  'C-S-E': 'Supportive Organiser',
  'E-R-I': 'Action Leader',
  'R-E-I': 'Action Leader',
  'I-A-C': 'Creative Thinker',
  'A-I-C': 'Creative Thinker'
};

const ARCHETYPE_BY_DOMINANT_PAIR = {
  'A|I': 'Creative Thinker',
  'I|A': 'Creative Thinker',
  'A|R': 'Structural Creator',
  'R|A': 'Structural Creator',
  'I|R': 'Technical Innovator',
  'R|I': 'Technical Innovator',
  'S|I': 'People Scientist',
  'I|S': 'People Scientist',
  'E|I': 'Entrepreneurial Analyst',
  'C|I': 'Analytical Strategist',
  'I|C': 'Analytical Strategist',
  'E|S': 'People Leader',
  'S|E': 'Practical Helper',
  'C|E': 'Strategic Planner',
  'E|C': 'Strategic Planner',
  'A|S': 'Empathetic Creator',
  'S|A': 'Empathetic Creator',
  'A|E': 'Creative Entrepreneur',
  'R|C': 'Precision Executor',
  'C|R': 'Precision Executor'
};

function orderedTopThreeCodes(state) {
  return [...RIASEC_CODES].sort((a, b) => {
    const d = (state.normalized[b] ?? 0) - (state.normalized[a] ?? 0);
    if (d !== 0) return d;
    return a.localeCompare(b);
  }).slice(0, 3);
}

/**
 * Student-facing archetype title (e.g. "Structural Creator").
 * @param {{ normalized: Record<string, number> }} state
 */
export function resolveArchetypeDisplayName(state) {
  if (!state?.normalized) return 'Versatile Professional';
  const t3 = orderedTopThreeCodes(state);
  const key = t3.join('-');
  if (ARCHETYPE_BY_ORDERED_TOP3[key]) return ARCHETYPE_BY_ORDERED_TOP3[key];
  const set = new Set(t3);
  if (set.has('A') && set.has('I') && set.has('R')) return 'Structural Creator';
  const pairKey = `${t3[0]}|${t3[1]}`;
  if (ARCHETYPE_BY_DOMINANT_PAIR[pairKey]) return ARCHETYPE_BY_DOMINANT_PAIR[pairKey];
  return 'Versatile Professional';
}

export function getArchetypeTagline(displayName) {
  return ARCHETYPE_DESCRIPTIONS[displayName] || ARCHETYPE_DESCRIPTIONS['Versatile Professional'];
}

/** Normalized key for alias map (display layer only; mirrors careerEngine title normalization) */
function normalizeTitleKeyForDescription(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Pathway titles that don't fuzzy-match DB names — resolve to a record with traits + why.
 * Keys are normalizeTitleKeyForDescription values.
 */
const DESCRIPTION_TITLE_ALIASES = {
  'ux/ui designer': 'UX Designer',
  'certified public accountant': 'Chartered Accountant',
  'corporate attorney': 'Lawyer'
};

/**
 * When no DB row matches: same trait emphasis as careerEngine TITLE_TRAIT_HINTS (display-only).
 * Optional `why` fills gaps for descriptions without touching careerDatabase / careerEngine.
 */
const DESCRIPTION_TRAIT_HINTS = [
  { re: /data scientist|machine learning|ai research/i, traits: { I: 0.62, C: 0.38 } },
  { re: /software|developer|web|database|mobile app/i, traits: { I: 0.55, R: 0.45 } },
  { re: /cyber|security/i, traits: { I: 0.55, C: 0.45 } },
  {
    re: /cloud|architect|solutions architect|systems admin|network/i,
    traits: { I: 0.5, R: 0.35, C: 0.15 }
  },
  { re: /engineer|robotics|civil|mechanical/i, traits: { R: 0.45, I: 0.4, C: 0.15 } },
  { re: /doctor|nurse|medical|health|therapist|psychologist/i, traits: { S: 0.45, I: 0.35, R: 0.2 } },
  { re: /design|ux|ui|graphic|industrial designer/i, traits: { A: 0.55, I: 0.25, S: 0.2 } },
  { re: /market|brand|social media|content|pr |editor|journalist/i, traits: { E: 0.35, A: 0.35, S: 0.3 } },
  { re: /manager|consultant|business|project manager|operations/i, traits: { E: 0.45, C: 0.3, I: 0.25 } },
  { re: /accountant|auditor|tax|finance|banker|planner/i, traits: { C: 0.45, E: 0.3, I: 0.25 } },
  { re: /law|attorney|paralegal|legal/i, traits: { E: 0.4, I: 0.35, C: 0.25 } },
  { re: /teacher|counsellor|writer|policy|humanities/i, traits: { S: 0.4, A: 0.35, I: 0.25 } },
  {
    re: /research|scientist|biotech|environmental/i,
    traits: { I: 0.55, R: 0.25, C: 0.2 },
    why: ['Builds hypotheses', 'Peer review']
  },
  { re: /hotel|event|tourism|hospitality/i, traits: { S: 0.45, E: 0.35, A: 0.2 } }
];

function resolveTraitsWhyForDescription(title, state) {
  const key = normalizeTitleKeyForDescription(title);
  const aliased = DESCRIPTION_TITLE_ALIASES[key];
  const lookupTitle = aliased || title;
  let rec = resolveCareerRecordByTitle(lookupTitle);
  if (!rec && aliased) rec = resolveCareerRecordByTitle(title);

  let traits =
    rec?.traits && typeof rec.traits === 'object' ? { ...rec.traits } : {};
  let whyFromHint = null;

  const positive = Object.entries(traits).filter(([, v]) => Number(v) > 0);
  if (positive.length === 0) {
    for (const h of DESCRIPTION_TRAIT_HINTS) {
      if (h.re.test(title)) {
        traits = { ...h.traits };
        whyFromHint = h.why || null;
        break;
      }
    }
  }

  if (Object.entries(traits).filter(([, v]) => Number(v) > 0).length === 0) {
    const dc = state.dominantCode && RIASEC_CODES.includes(state.dominantCode) ? state.dominantCode : 'I';
    traits = { [dc]: 1 };
  }

  const whyLines = (() => {
    if (rec?.why?.length) {
      return rec.why.map((s) => String(s).trim()).filter(Boolean);
    }
    if (whyFromHint?.length) {
      return whyFromHint.map((s) => String(s).trim()).filter(Boolean);
    }
    return [];
  })();

  return { traits, whyLines };
}

function rawPercentForCode(state, code) {
  if (state.raw && typeof state.raw === 'object') {
    return Math.round(Number(state.raw[code]) || 0);
  }
  return Math.round((state.normalized[code] ?? 0) * 100);
}

function buildWhyClause(whyLines, trait1, trait2) {
  const a = whyLines[0] ? String(whyLines[0]).trim() : '';
  const b = whyLines[1] ? String(whyLines[1]).trim() : '';
  if (a && b) return `${a} and ${b}`;
  if (a) return a;
  const n1 = RIASEC_LONG[trait1] || trait1;
  const n2 = trait2 ? RIASEC_LONG[trait2] || trait2 : '';
  if (n2) return `${n1} and ${n2} strengths central to this pathway`;
  return `${n1} strengths central to this pathway`;
}

/**
 * Student-facing career line: career traits + `why` + raw profile %.
 * Does not alter careerEngine scoring.
 *
 * @param {string} title - Career title
 * @param {{ normalized: Record<string, number>, raw?: Record<string, number>, dominantCode?: string }} state
 */
export function generateStudentCareerDescription(title, state) {
  if (!state?.normalized) {
    return `Explore how your strengths could apply to ${title}.`;
  }

  const { traits, whyLines } = resolveTraitsWhyForDescription(title, state);
  const sortedTrait = Object.entries(traits)
    .filter(([, v]) => Number(v) > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const trait1 = sortedTrait[0]?.[0] || state.dominantCode || 'I';
  const w1 = Number(sortedTrait[0]?.[1]) || 0;
  const trait2 = sortedTrait[1]?.[0];
  const w2 = trait2 != null ? Number(sortedTrait[1][1]) || 0 : 0;

  const raw1 = rawPercentForCode(state, trait1);
  const raw2 = trait2 != null ? rawPercentForCode(state, trait2) : 0;

  const name1 = RIASEC_LONG[trait1] || trait1;
  const name2 = trait2 ? RIASEC_LONG[trait2] || trait2 : '';

  const whyClause = buildWhyClause(whyLines, trait1, trait2);

  const onlyOneCareerTrait = !trait2;
  const studentScoresClose = trait2 != null && Math.abs(raw1 - raw2) <= 5 && raw2 > 0;
  const careerWeightsClose =
    trait2 != null && Math.abs(w1 - w2) <= 0.08 && w2 >= 0.25;
  const usePattern2 =
    !onlyOneCareerTrait && trait2 != null && (studentScoresClose || careerWeightsClose);

  // Career's primary trait is very weak on the student's profile — avoid "strong fit" copy
  if (raw1 < 5) {
    return `This career needs ${name1} skills — worth exploring if you want to develop in this direction.`;
  }

  let line;
  if (usePattern2) {
    line = `Combines your ${name1} (${raw1}%) with ${name2} (${raw2}%) — ${whyClause}.`;
  } else if (raw1 >= 30) {
    line = `Strong ${name1} lean (${raw1}%) matches this work: ${whyClause}.`;
  } else {
    line = `Your ${name1} strength (${raw1}%) is a strong fit — ${whyClause}.`;
  }

  return line;
}

/**
 * Deduplicate careers across RIASEC rows: keep each title only under the (row × field) cell
 * with highest field-weight for that dimension (ties → higher student raw on row dimension).
 *
 * @param {Array<{ riasecCode: string, fields: Array<{ aspiringField: string, careers?: Array, careerPaths?: string[] }> }>} pathwayRows
 * @param {Record<string, number>} [rawScores] student raw RIASEC scores
 */
/** Dominant RIASEC from career DB only (no title-regex hints) — used to pin roles like Psychologist under Social */
function getCareerPrimaryTraitFromDb(title) {
  const rec = resolveCareerRecordByTitle(title);
  if (!rec?.traits || typeof rec.traits !== 'object') return null;
  const entries = Object.entries(rec.traits).filter(([, v]) => Number(v) > 0);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries[0][0];
}

/** Stable key for de-dupe maps (trim; avoid duplicate Map entries from whitespace) */
function normalizeCareerTitleKey(title) {
  return String(title || '').trim();
}

export const MAX_PATHWAY_CAREERS_PER_FIELD = 3;

/**
 * Normalized list for pathway UI/PDF: prefer `careers`, dedupe by title, cap at `max`.
 */
export function slicePathwayCareersForDisplay(field, max = MAX_PATHWAY_CAREERS_PER_FIELD) {
  const cap = max > 0 ? max : MAX_PATHWAY_CAREERS_PER_FIELD;
  const careers = Array.isArray(field?.careers) ? field.careers : [];
  const paths = Array.isArray(field?.careerPaths) ? field.careerPaths : [];
  const base = careers.length > 0 ? careers : paths.map((title) => ({ title }));
  const seen = new Set();
  const out = [];
  for (const c of base) {
    if (!c || c.title == null) continue;
    const k = normalizeCareerTitleKey(c.title).toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(c);
    if (out.length >= cap) break;
  }
  return out;
}

/**
 * Build a normalized, capped pathway view for both UI and PDF.
 * Uses the same de-dupe and slicing policy so outputs stay identical.
 */
export function buildTopPathwayRowsForDisplay(
  fieldAnalysis,
  { topRows = 3, topFields = 3, topCareers = MAX_PATHWAY_CAREERS_PER_FIELD } = {}
) {
  const rows = fieldAnalysis?.pathwayRows || [];
  const raw = fieldAnalysis?.state?.raw || {};
  const deduped = dedupePathwayCareersAcrossRows(rows, raw);

  return deduped.slice(0, topRows).map((row) => ({
    ...row,
    fields: (row.fields || []).slice(0, topFields).map((field) => {
      const careers = slicePathwayCareersForDisplay(field, topCareers);
      return {
        ...field,
        careers,
        careerPaths: careers.map((c) => c.title).filter(Boolean)
      };
    })
  }));
}

/**
 * Centralized policy for cross-row placement (single source for pathway override behavior).
 * Keeping these in one object avoids hidden rule drift across functions/files.
 */
export const PATHWAY_PLACEMENT_POLICY = {
  skipDbPrimaryPinFields: new Set(PATHWAY_OVERRIDE_CONFIG.skipDbPrimaryPinFields || []),
  forceRowByFieldAndTitle: Object.fromEntries(
    Object.entries(PATHWAY_OVERRIDE_CONFIG.forceRowByFieldAndTitle || {}).map(([field, rule]) => [
      field,
      {
        rowCode: rule.rowCode,
        titles: new Set(rule.titles || [])
      }
    ])
  ),
  forceRowByCareerId: { ...(PATHWAY_OVERRIDE_CONFIG.forceRowByCareerId || {}) }
};

function pickWinningPlacementForCareer(title, placements, rawScores, fieldWeightsMap) {
  const weightOf = (p) => fieldWeightsMap[p.fieldName]?.[p.rowCode] ?? 0;
  const viable = placements.filter((p) => weightOf(p) > 0);
  const basePool = viable.length ? viable : placements;

  const fieldName = placements[0]?.fieldName;
  const nk = normalizeCareerTitleKey(title).toLowerCase();

  let pool;
  const forced = PATHWAY_PLACEMENT_POLICY.forceRowByFieldAndTitle[fieldName];
  if (forced && forced.titles.has(nk)) {
    const forcedPool = basePool.filter((p) => p.rowCode === forced.rowCode && weightOf(p) > 0);
    pool = forcedPool.length ? forcedPool : basePool;
  } else {
    const skipDbPrimaryPin =
      fieldName && PATHWAY_PLACEMENT_POLICY.skipDbPrimaryPinFields.has(fieldName);
    const primary = skipDbPrimaryPin ? null : getCareerPrimaryTraitFromDb(title);
    const primaryPool = primary
      ? basePool.filter((p) => p.rowCode === primary && weightOf(p) > 0)
      : [];
    pool = primaryPool.length ? primaryPool : basePool;
  }

  const affinity = (p) => weightOf(p) * (Number(rawScores[p.rowCode]) || 0);

  let best = pool[0];
  for (let i = 1; i < pool.length; i += 1) {
    const p = pool[i];
    const ap = affinity(p);
    const ab = affinity(best);
    if (ap > ab) {
      best = p;
    } else if (ap === ab) {
      const wp = weightOf(p);
      const wb = weightOf(best);
      if (wp > wb) best = p;
      else if (wp === wb) {
        const rp = Number(rawScores[p.rowCode]) || 0;
        const rb = Number(rawScores[best.rowCode]) || 0;
        if (rp > rb) best = p;
        else if (
          rp === rb &&
          `${p.rowCode}|${p.fieldName}`.localeCompare(`${best.rowCode}|${best.fieldName}`) < 0
        ) {
          best = p;
        }
      }
    }
  }
  return best;
}

/**
 * Second pass: walk rows in pathway order; each title is kept only the first time it appears.
 * Catches any duplicate listings across later rows (e.g. stale careerPaths fallback in UI).
 */
function removeDuplicateCareerTitlesByRowOrder(rows) {
  const seen = new Set();
  return rows.map((row) => ({
    ...row,
    fields: (row.fields || [])
      .map((field) => {
        const list = field.careers?.length
          ? field.careers
          : (field.careerPaths || []).map((t) => ({ title: t }));
        const filtered = list.filter((c) => {
          const key = normalizeCareerTitleKey(c.title);
          if (!key) return false;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        const paths = filtered.map((c) => c.title).filter(Boolean);
        return { ...field, careers: filtered, careerPaths: paths };
      })
      .filter((field) => (field.careers?.length || field.careerPaths?.length || 0) > 0)
  }));
}

export function dedupePathwayCareersAcrossRows(pathwayRows, rawScores = {}) {
  if (!pathwayRows?.length) return pathwayRows;
  const fieldWeightsMap = getFieldWeightsRecord();
  const byTitle = new Map();

  for (const row of pathwayRows) {
    const rowCode = row.riasecCode;
    for (const field of row.fields || []) {
      const fname = field.aspiringField;
      const w = fieldWeightsMap[fname]?.[rowCode] ?? 0;
      const careers = field.careers?.length
        ? field.careers
        : (field.careerPaths || []).map((t) => ({ title: t }));
      for (const c of careers) {
        const key = normalizeCareerTitleKey(c.title);
        if (!key) continue;
        const arr = byTitle.get(key) || [];
        arr.push({ rowCode, fieldName: fname, weight: w, career: c });
        byTitle.set(key, arr);
      }
    }
  }

  const winner = new Map();
  for (const [title, placements] of byTitle) {
    winner.set(title, pickWinningPlacementForCareer(title, placements, rawScores, fieldWeightsMap));
  }

  const rowsAfterWinner = pathwayRows.map((row) => ({
    ...row,
    fields: (row.fields || [])
      .map((field) => {
        const rowCode = row.riasecCode;
        const fname = field.aspiringField;
        const careers = field.careers?.length
          ? field.careers
          : (field.careerPaths || []).map((t) => ({ title: t }));
        const filtered = careers.filter((c) => {
          const key = normalizeCareerTitleKey(c.title);
          const w = winner.get(key);
          return w && w.rowCode === rowCode && w.fieldName === fname;
        });
        const paths = filtered.map((c) => c.title).filter(Boolean);
        // Always sync careerPaths — UI uses careerPaths when careers is empty, which hid the dedupe
        return { ...field, careers: filtered, careerPaths: paths };
      })
      .filter((field) => (field.careers?.length || field.careerPaths?.length || 0) > 0)
  }));

  return removeDuplicateCareerTitlesByRowOrder(rowsAfterWinner);
}

export function getTraitHighlights(state, { top = 3, bottom = 2 } = {}) {
  const sorted = RIASEC_CODES.map((code) => ({
    code,
    label: RIASEC_LONG[code],
    share: state.normalized[code] ?? 0,
    raw: state.raw[code] ?? 0
  })).sort((a, b) => b.share - a.share);

  return {
    topTraits: sorted.slice(0, top),
    bottomTraits: sorted.slice(-bottom).reverse()
  };
}

/**
 * Six counsellor-only discussion prompts — every line is built from this student's scores,
 * top careers, fields, and traits (simple English).
 *
 * @param {Array<{ name?: string, title?: string }>} topCareers
 * @param {string[]} topFields
 * @param {string[]} topTraits RIASEC codes, strongest first
 * @param {string[]} weakTraits RIASEC codes, weakest first
 * @param {Record<string, number>} rawScores
 * @returns {string[]}
 */
export function generateDiscussionPrompts(topCareers, topFields, topTraits, weakTraits, rawScores) {
  const traitNames = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional'
  };

  const traitPersonality = {
    R: 'practical and hands-on',
    I: 'analytical and curious',
    A: 'creative and expressive',
    S: 'caring and people-focused',
    E: 'confident and leadership-driven',
    C: 'organized and detail-oriented'
  };

  const traitActivity = {
    R: 'building or fixing something',
    I: 'solving a difficult problem or researching something',
    A: 'drawing, writing, designing, or making something creative',
    S: 'helping someone or working in a group',
    E: 'leading a group or convincing someone',
    C: 'organizing, planning, or following a process carefully'
  };

  const traitWeakDescription = {
    R: 'hands-on or practical tasks',
    I: 'research or analytical thinking',
    A: 'creative or expressive work',
    S: 'working with or helping people',
    E: 'leading or persuading others',
    C: 'following strict rules or detailed procedures'
  };

  const careerTitle = (c) => (c && (c.name || c.title || '').trim()) || '';

  const trait1 = topTraits?.[0] || 'R';
  const trait2 = topTraits?.[1] || 'I';
  const weakTrait = weakTraits?.[0] || 'C';

  const trait1Name = traitNames[trait1] || trait1;
  const trait2Name = traitNames[trait2] || trait2;
  const weakTraitName = traitNames[weakTrait] || weakTrait;

  const trait1Score = Math.round(Number(rawScores?.[trait1]) || 0);
  const trait2Score = Math.round(Number(rawScores?.[trait2]) || 0);
  const weakScore = Math.round(Number(rawScores?.[weakTrait]) || 0);

  const career1 = careerTitle(topCareers?.[0]) || 'your top career match';
  const career2 = careerTitle(topCareers?.[1]) || 'your second career match';
  const career3 = careerTitle(topCareers?.[2]) || 'your third career match';

  const field1 = topFields?.[0] || 'your top field';
  const field2 = topFields?.[1] || 'your second field';

  const personality1 = traitPersonality[trait1] || 'balanced';
  const activity1 = traitActivity[trait1] || 'something you enjoyed doing';
  const weakDescription = traitWeakDescription[weakTrait] || 'this type of work';

  return [
    `Question 1: Your profile shows you are ${personality1} (${trait1Name}: ${trait1Score}%). Can you tell me about a time you did something like ${activity1}? How did it feel?`,
    `Question 2: Your best career match is ${career1}. What do you already know about this job? Have you ever tried anything like this — in school, at home, or with friends?`,
    `Question 3: Your profile shows a good match with the ${field1} area. What sounds exciting to you about this? What would you want to know more about?`,
    `Question 4: Your profile also matches with ${field2}. How does ${field2} feel compared to ${field1} — more interesting, less interesting, or about the same? Why?`,
    `Question 5: You also scored ${trait2Score}% in ${trait2Name}. Between ${career1}, ${career2}, and ${career3} — which one feels most like you? Why did you pick that one?`,
    `Question 6: Your lowest score is ${weakTraitName} (${weakScore}%). Do you find ${weakDescription} difficult or uninteresting? Can you give an example?`
  ];
}

export function deriveArchetype(state) {
  const { topTraits, bottomTraits } = getTraitHighlights(state, { top: 3, bottom: 2 });
  const [a, b, c] = topTraits;
  const low = bottomTraits[0];

  const parts = [];
  if (a?.share >= 0.22) {
    parts.push(`strong ${a.label}`);
  } else if (a) {
    parts.push(`leaning ${a.label}`);
  }
  if (b && b.share >= 0.15) {
    parts.push(`with notable ${b.label} energy`);
  }
  if (c && c.share >= 0.12) {
    parts.push(`and supporting ${c.label} tendencies`);
  }
  let sentence = `Your current pattern shows ${parts.join(', ') || 'a balanced RIASEC mix'}.`;
  if (low && low.share < 0.12) {
    sentence += ` ${low.label} is relatively less expressed right now — worth exploring whether that reflects preference or simply less exposure.`;
  }

  const displayName = resolveArchetypeDisplayName(state);
  const tagline = getArchetypeTagline(displayName);

  return {
    summary: sentence,
    headline: `${a?.label ?? 'Balanced'} · ${b?.label ?? 'Mixed'} profile`,
    displayName,
    tagline,
    topCodes: topTraits.map((t) => t.code),
    bottomCodes: bottomTraits.map((t) => t.code)
  };
}

/**
 * @param {Array<{ code: string, score?: number }>|Record<string, number>} dimensions
 * @param {ReturnType<typeof getFieldRecommendations> | null} [fieldAnalysis]
 */
export function buildCounsellorReport(dimensions, fieldAnalysis = null) {
  const analysis = fieldAnalysis ?? getFieldRecommendations(dimensions);

  if (!analysis.valid) {
    return {
      generatedAt: new Date().toISOString(),
      valid: false,
      confidence: analysis.confidence,
      confidenceMessage: analysis.confidenceMessage,
      profile: {
        traits: {
          topTraits: [],
          bottomTraits: [],
          raw: analysis.state?.raw ?? {},
          normalized: analysis.state?.normalized ?? {},
          dominantCode: analysis.state?.dominantCode ?? 'I'
        },
        archetype: {
          summary: analysis.confidenceMessage || 'No profile summary available.',
          headline: 'Profile unavailable',
          displayName: 'Versatile Professional',
          tagline: ARCHETYPE_DESCRIPTIONS['Versatile Professional'],
          topCodes: [],
          bottomCodes: []
        }
      },
      recommendations: {
        topFields: [],
        highlightedCareerTitles: [],
        rankedFields: [],
        rankedCareersGlobal: []
      },
      questions: [],
      discussionPrompts: [],
      pathwayRows: [],
      pathwayRowsForDisplay: []
    };
  }

  const { state, topFields, pathwayRows, rankedFields, rankedCareersGlobal, confidence, confidenceMessage } =
    analysis;
  const { topTraits, bottomTraits } = getTraitHighlights(state);
  const archetype = deriveArchetype(state);

  const topCareerRows = (rankedCareersGlobal || []).slice(0, 3);
  const rankedFieldNames = (rankedFields || []).map((r) => r.field).filter(Boolean);
  const uniqueFields = [...new Set(rankedFieldNames)];
  const topTwoFields =
    uniqueFields.length >= 2
      ? uniqueFields.slice(0, 2)
      : uniqueFields.length === 1
        ? [uniqueFields[0], uniqueFields[0]]
        : ['your top field', 'your second field'];

  const topTraitCodes = [...archetype.topCodes];
  while (topTraitCodes.length < 3) {
    const fill = RIASEC_CODES.find((c) => !topTraitCodes.includes(c));
    if (!fill) break;
    topTraitCodes.push(fill);
  }

  const weakTraitCodes =
    archetype.bottomCodes?.length > 0 ? [archetype.bottomCodes[0]] : ['C'];

  const discussionPrompts = generateDiscussionPrompts(
    topCareerRows,
    topTwoFields,
    topTraitCodes.slice(0, 3),
    weakTraitCodes,
    state.raw || {}
  );

  const questions = [];

  const highlightedCareerTitles = (rankedCareersGlobal || [])
    .slice(0, 9)
    .map((c) => c.title)
    .filter(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    valid: true,
    confidence,
    confidenceMessage,
    profile: {
      traits: {
        topTraits,
        bottomTraits,
        raw: state.raw,
        normalized: state.normalized,
        dominantCode: state.dominantCode
      },
      archetype
    },
    recommendations: {
      topFields,
      highlightedCareerTitles,
      rankedFields,
      rankedCareersGlobal: rankedCareersGlobal || []
    },
    questions,
    discussionPrompts,
    pathwayRows,
    /** Same rows as `pathwayRows` but each career title appears only once (best-matching RIASEC row). */
    pathwayRowsForDisplay: dedupePathwayCareersAcrossRows(pathwayRows, state.raw)
  };
}

/** @deprecated Use buildCounsellorReport */
export function buildCareerReport(dimensions) {
  return buildCounsellorReport(dimensions);
}
