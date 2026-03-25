/**
 * RIASEC recommendation engine: field scores + career-level ranking + confidence + plain-language WHY.
 */

import {
  FIELDS_CONFIG,
  RIASEC_CODES,
  buildCareerPathwaysData,
  RIASEC_CAREER_FIELDS_MAPPING,
  getFieldWeightsRecord
} from '../data/fieldsConfig.js';
import { careerDatabase } from '../data/careerDatabase.js';
import { PATHWAY_OVERRIDE_CONFIG } from './pathwayOverrideConfig.js';

export const LOW_AFFINITY_THRESHOLD = 0.15;
export const HIGH_AFFINITY_THRESHOLD = 0.2;
export const STRONG_DUAL_SIGNAL = 0.5;
export const BOOST_STRONG = 1.15;
export const BOOST_MODERATE = 1.1;
export const BOOST_SLIGHT = 1.05;
export const PENALTY_CRITICAL = 0.6;
export const PENALTY_MAJOR = 0.65;
export const PENALTY_MODERATE = 0.75;
export const PENALTY_MINOR = 0.7;
export const DATA_SCIENCE_R_DOMINANT_PENALTY = 0.8;

/**
 * Confidence thresholds are centralized for easy tuning without changing logic.
 * Values intentionally preserve current behavior.
 */
export const CONFIDENCE_CONFIG = {
  /** Raw score sum below this → weak engagement (assumes typical 0–100-ish per dimension) */
  LOW_TOTAL_THRESHOLD: 42,
  /** No dimension above this (raw) → weak */
  LOW_MAX_DIMENSION_RAW: 8,
  /** Normalized spread below this → “flat” profile */
  FLAT_PROFILE_SPREAD: 0.03,
  /**
   * Min gap between 1st and 2nd normalized RIASEC share (0–1 scale) for High confidence.
   * 0.15 = 15 percentage points on the profile bars.
   */
  HIGH_GAP: 0.15
};

export const RIASEC_CONFIDENCE_EXPLANATION_HIGH =
  'Clear interest direction — strong fit areas identified';

export const RIASEC_CONFIDENCE_EXPLANATION_MODERATE =
  'Multiple interests present — explore before deciding';

export const RIASEC_CONFIDENCE_EXPLANATION_LOW =
  'Preferences are not yet clear — more exploration needed';

const FIELD_WEIGHT_IN_CAREER = 0.55;
const TRAIT_WEIGHT_IN_CAREER = 0.45;

const RIASEC_LABELS = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

const STRENGTH_FOCUS = {
  R: 'hands-on, practical work',
  I: 'analytical thinking and problem-solving',
  A: 'creativity and self-expression',
  S: 'helping people and collaboration',
  E: 'leadership, influence, and initiative',
  C: 'structure, accuracy, and dependable routines'
};

/** Fallback when title not in DB: regex → trait emphasis (sums ~1) */
const TITLE_TRAIT_HINTS = [
  { re: /data scientist|machine learning|ai research/i, traits: { I: 0.62, C: 0.38 } },
  { re: /software|developer|web|database|mobile app/i, traits: { I: 0.55, R: 0.45 } },
  { re: /cyber|security/i, traits: { I: 0.55, C: 0.45 } },
  { re: /cloud|architect|solutions architect|systems admin|network/i, traits: { I: 0.5, R: 0.35, C: 0.15 } },
  { re: /engineer|robotics|civil|mechanical/i, traits: { R: 0.45, I: 0.4, C: 0.15 } },
  { re: /doctor|nurse|medical|health|therapist|psychologist/i, traits: { S: 0.45, I: 0.35, R: 0.2 } },
  { re: /design|ux|ui|graphic|industrial designer/i, traits: { A: 0.55, I: 0.25, S: 0.2 } },
  { re: /market|brand|social media|content|pr |editor|journalist/i, traits: { E: 0.35, A: 0.35, S: 0.3 } },
  { re: /manager|consultant|business|project manager|operations/i, traits: { E: 0.45, C: 0.3, I: 0.25 } },
  { re: /accountant|auditor|tax|finance|banker|planner/i, traits: { C: 0.45, E: 0.3, I: 0.25 } },
  { re: /law|attorney|paralegal|legal/i, traits: { E: 0.4, I: 0.35, C: 0.25 } },
  { re: /teacher|counsellor|writer|policy|humanities/i, traits: { S: 0.4, A: 0.35, I: 0.25 } },
  { re: /research|scientist|biotech|environmental/i, traits: { I: 0.55, R: 0.25, C: 0.2 } },
  { re: /hotel|event|tourism|hospitality/i, traits: { S: 0.45, E: 0.35, A: 0.2 } }
];

/**
 * Derived map used by pathway row rendering logic.
 * Behavior is unchanged; source moved to PATHWAY_OVERRIDE_CONFIG.
 */
const PATHWAY_ROW_FIELD_POLICY = Object.fromEntries(
  Object.entries(PATHWAY_OVERRIDE_CONFIG.forceFieldInRow || {}).map(([rowCode, fields]) => [
    rowCode,
    { mustIncludeField: fields?.[0] || null }
  ])
);

// ─── Input / normalization ─────────────────────────────────────────────────

export function isValidDimensionsInput(dimensions) {
  if (!dimensions) return false;
  if (!Array.isArray(dimensions)) return false;
  if (dimensions.length === 0) return false;
  return dimensions.some((d) => d && typeof d.code === 'string' && RIASEC_CODES.includes(d.code));
}

/**
 * @param {Array<{ code: string, score?: number }>|Record<string, number>} input
 * @returns {Record<string, number>}
 */
export function parseRiasecInput(input) {
  const raw = Object.fromEntries(RIASEC_CODES.map((c) => [c, 0]));
  if (!input) return raw;
  if (Array.isArray(input)) {
    input.forEach((d) => {
      if (d?.code && raw[d.code] !== undefined) raw[d.code] = Math.max(0, Number(d.score) || 0);
    });
    return raw;
  }
  if (typeof input === 'object') {
    RIASEC_CODES.forEach((code) => {
      raw[code] = Math.max(0, Number(input[code]) || 0);
    });
  }
  return raw;
}

export function normalizeRiasecScores(rawScoreMap) {
  const total = RIASEC_CODES.reduce((s, c) => s + (rawScoreMap[c] || 0), 0);
  const safeTotal = total > 0 ? total : 1;
  const normalized = {};
  RIASEC_CODES.forEach((code) => {
    normalized[code] = (rawScoreMap[code] || 0) / safeTotal;
  });
  const sortedDims = Object.entries(normalized)
    .map(([code, score]) => ({ code, score }))
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.code.localeCompare(b.code)));
  const dominantCode = sortedDims[0]?.code || 'I';
  return {
    raw: { ...rawScoreMap },
    normalized,
    dominantCode,
    sortedDims
  };
}

function rawTotal(raw) {
  return RIASEC_CODES.reduce((s, c) => s + (raw[c] || 0), 0);
}

function maxRawDimension(raw) {
  return Math.max(...RIASEC_CODES.map((c) => raw[c] || 0), 0);
}

function isFlatNormalizedProfile(normalized) {
  const vals = RIASEC_CODES.map((c) => normalized[c] || 0);
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  return mx - mn < CONFIDENCE_CONFIG.FLAT_PROFILE_SPREAD;
}

function scoresEffectivelyEqual(a, b, eps = 1e-8) {
  return Math.abs(a - b) < eps;
}

// ─── Field scoring (existing) ───────────────────────────────────────────────

function baseFieldCompatibility(fieldName, normalized, fieldWeightsMap) {
  const weights = fieldWeightsMap[fieldName] || {};
  let compatibility = 0;
  RIASEC_CODES.forEach((code) => {
    compatibility += (weights[code] || 0) * (normalized[code] || 0);
  });
  return compatibility;
}

export function applyBehavioralConflicts(field, baseCompatibility, ctx) {
  let finalScore = baseCompatibility;
  const { normalized: n, dominantCode } = ctx;
  const Rn = n.R;
  const In = n.I;
  const An = n.A;
  const Sn = n.S;
  const En = n.E;
  const Cn = n.C;

  switch (field) {
    case 'Engineering':
      if (dominantCode === 'R') finalScore *= BOOST_STRONG;
      if (An > Rn && Rn < LOW_AFFINITY_THRESHOLD) finalScore *= PENALTY_MODERATE;
      break;
    case 'Tech':
      if (In + Rn > STRONG_DUAL_SIGNAL) finalScore *= BOOST_MODERATE;
      if (Cn > Math.max(Rn, In) && Rn + In < 0.3) finalScore *= PENALTY_MINOR;
      break;
    case 'Medical & Health':
      if (Sn < LOW_AFFINITY_THRESHOLD) finalScore *= PENALTY_MAJOR;
      else if (Rn > Math.max(In, Sn)) finalScore *= PENALTY_MODERATE;
      break;
    case 'Data Science':
      if (Rn > In) finalScore *= DATA_SCIENCE_R_DOMINANT_PENALTY;
      if (In > Math.max(Rn, An, Sn, En, Cn)) finalScore *= BOOST_MODERATE;
      break;
    case 'Data Analytics':
      if (An > Math.max(In, Cn)) finalScore *= PENALTY_MODERATE;
      break;
    case 'Pure & Applied Science':
      if (En > Math.max(In, Rn)) finalScore *= PENALTY_MODERATE;
      break;
    case 'Business & Management':
      if (Rn > Math.max(En, Cn)) finalScore *= PENALTY_MODERATE;
      break;
    case 'Accounting':
      if (Rn >= Cn) finalScore *= PENALTY_CRITICAL;
      else if (In > Cn * 1.2) finalScore *= PENALTY_MODERATE;
      else if (An > HIGH_AFFINITY_THRESHOLD) finalScore *= PENALTY_MODERATE;
      break;
    case 'Finance':
      if (An > Math.max(En, Cn)) finalScore *= PENALTY_MODERATE;
      if (En > Math.max(Cn, In)) finalScore *= BOOST_SLIGHT;
      break;
    case 'Humanities':
      if (Cn > Math.max(An, Sn)) finalScore *= PENALTY_MINOR;
      break;
    case 'Design':
      if (Cn >= An) finalScore *= PENALTY_CRITICAL;
      break;
    case 'Media':
      if (Rn > Math.max(An, En)) finalScore *= PENALTY_MODERATE;
      break;
    case 'Networking':
      if (Rn + In > STRONG_DUAL_SIGNAL) finalScore *= BOOST_MODERATE;
      if (An > Math.max(Rn, In)) finalScore *= PENALTY_MODERATE;
      break;
    case 'Marketing':
      if (Cn > Math.max(En, An)) finalScore *= PENALTY_MINOR;
      break;
    case 'Law':
      if (An > Math.max(En, Cn, In)) finalScore *= PENALTY_MINOR;
      break;
    case 'Computer Applications':
      if (In > Math.max(Rn, Cn, An, Sn, En)) finalScore *= BOOST_STRONG;
      if (Cn > Math.max(In, Rn) && Rn + In < 0.4) finalScore *= PENALTY_MINOR;
      break;
    case 'Hospitality':
      if (In > Math.max(Sn, En) && Sn < HIGH_AFFINITY_THRESHOLD) finalScore *= PENALTY_MODERATE;
      break;
    default:
      break;
  }
  return finalScore;
}

export function computeFieldScoreMap(state) {
  const fieldWeightsMap = getFieldWeightsRecord();
  const ctx = { normalized: state.normalized, dominantCode: state.dominantCode };
  const map = {};
  Object.keys(FIELDS_CONFIG).forEach((fieldName) => {
    const base = baseFieldCompatibility(fieldName, state.normalized, fieldWeightsMap);
    map[fieldName] = applyBehavioralConflicts(fieldName, base, ctx);
  });
  return map;
}

// ─── Career DB + title matching ───────────────────────────────────────────

function normalizeTitleKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function titleTokenSet(s) {
  return new Set(
    normalizeTitleKey(s)
      .split(' ')
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

export function resolveCareerRecordByTitle(title) {
  const key = normalizeTitleKey(title);
  if (!key) return null;
  const exact = careerDatabase.find((c) => normalizeTitleKey(c.name) === key);
  if (exact) return exact;

  const keyTokens = titleTokenSet(key);
  let best = null;
  let bestScore = 0;

  for (const rec of careerDatabase) {
    const recTokens = titleTokenSet(rec.name);
    let overlap = 0;
    for (const tok of keyTokens) {
      if (recTokens.has(tok)) overlap += 1;
    }
    if (overlap === 0) continue;

    const score = overlap / Math.max(keyTokens.size, recTokens.size, 1);
    if (
      score > bestScore ||
      (Math.abs(score - bestScore) < 1e-8 && best && rec.name.localeCompare(best.name) < 0)
    ) {
      best = rec;
      bestScore = score;
    }
  }

  return bestScore >= 0.6 ? best : null;
}

function traitsFromTitleOrField(title, fieldWeights) {
  const rec = resolveCareerRecordByTitle(title);
  if (rec?.traits) return { ...rec.traits, why: rec.why || [] };

  for (const hint of TITLE_TRAIT_HINTS) {
    if (hint.re.test(title)) return { ...hint.traits, why: [] };
  }

  const w = fieldWeights || {};
  const sum = RIASEC_CODES.reduce((s, c) => s + (w[c] || 0), 0) || 1;
  const traits = {};
  RIASEC_CODES.forEach((c) => {
    traits[c] = (w[c] || 0) / sum;
  });
  return { ...traits, why: [] };
}

/**
 * Trait alignment 0–1: weighted overlap of student normalized profile with career emphasis.
 */
export function computeCareerTraitAlignment(title, normalized, fieldName, fieldWeightsMap) {
  const fieldW = fieldWeightsMap[fieldName] || {};
  const profile = traitsFromTitleOrField(title, fieldW);
  const traits = { ...profile };
  delete traits.why;

  let num = 0;
  let den = 0;
  RIASEC_CODES.forEach((code) => {
    const w = traits[code] || 0;
    if (w <= 0) return;
    num += w * (normalized[code] || 0);
    den += w;
  });
  if (den <= 0) return 0;
  return num / den;
}

function getWhyLinesForTitle(title) {
  const rec = resolveCareerRecordByTitle(title);
  return rec?.why?.length ? [...rec.why] : [];
}

// ─── Plain-language WHY (no numbers) ───────────────────────────────────────

/** Deterministic pick so the same role/field stays stable but different pairs get variety */
function explanationSeedHash(str) {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickExplanationVariant(seedKey, variants) {
  if (!variants?.length) return '';
  const idx = explanationSeedHash(seedKey) % variants.length;
  return variants[idx];
}

/**
 * Opening clause: always names the top 3 RIASEC types by normalized score (ties broken R→C).
 */
export function buildTopTraitOpening(state, maxTraits = 3) {
  const sorted = [...RIASEC_CODES].sort((a, b) => {
    const d = (state.normalized[b] || 0) - (state.normalized[a] || 0);
    if (d !== 0) return d;
    return a.localeCompare(b);
  });
  const topScore = state.normalized[sorted[0]] || 0;
  if (topScore < 1e-9) {
    return 'Your interests look fairly balanced across areas.';
  }
  const n = Math.min(Math.max(1, maxTraits), 3);
  const pick = sorted.slice(0, n);
  const labels = pick.map((c) => RIASEC_LABELS[c]);
  if (labels.length === 1) {
    return `Based on your strong ${labels[0]} strengths`;
  }
  if (labels.length === 2) {
    return `Based on your strong ${labels[0]} and ${labels[1]} strengths`;
  }
  return `Based on your strong ${labels[0]}, ${labels[1]}, and ${labels[2]} strengths`;
}

/** Second sentence for field-level copy — field-specific, rotated for variety */
const FIELD_EXPLANATION_TAILS = {
  Engineering: [
    'Engineering fits people who like turning problems into physical or technical solutions.',
    'This field rewards curiosity about how things work and patience with structured design.',
    'You may thrive here if you enjoy building systems and testing ideas in the real world.',
    'Hands-on problem solving and steady attention to detail matter a lot in this space.'
  ],
  Tech: [
    'Tech roles suit those who enjoy logic, tools, and improving how digital systems behave.',
    'This area is a strong match if you like learning new frameworks and fixing complex issues.',
    'Many tech paths reward investigative thinking paired with practical implementation.',
    'If you like iterative building and clear specifications, this field is worth a closer look.'
  ],
  'Medical & Health': [
    'Health careers often fit people drawn to supporting others through science and care.',
    'This field suits steady communicators who value responsibility and human impact.',
    'You may enjoy it if you like combining knowledge with empathy in high-trust settings.',
    'Patience, precision, and people skills all show up strongly in these pathways.'
  ],
  'Data Science': [
    'Data science suits minds that enjoy patterns, models, and careful interpretation.',
    'This field fits if you like asking “why” and backing answers with evidence.',
    'Strong match when you enjoy blending coding, statistics, and domain questions.',
    'Curiosity about uncertainty and structured experimentation helps a lot here.'
  ],
  'Data Analytics': [
    'Analytics fits people who like turning numbers into decisions others can use.',
    'This field rewards organized thinking and clear storytelling from data.',
    'You may enjoy it if you like dashboards, metrics, and spotting trends early.',
    'A good fit when you prefer reliable methods and business-facing clarity.'
  ],
  'Pure & Applied Science': [
    'Science paths suit those who enjoy discovery, lab or field rigor, and deep questions.',
    'This field fits patient investigators who like evidence and repeatable methods.',
    'You may thrive here if theoretical and applied work both feel energizing.',
    'Curiosity and discipline matter more than quick answers in this space.'
  ],
  'Business & Management': [
    'Business and management suit people who enjoy coordinating people and priorities.',
    'This field fits if you like planning, negotiation, and seeing outcomes scale.',
    'You may enjoy leading projects, aligning teams, and improving how work gets done.',
    'Enterprising energy plus structure often shows up in strong matches here.'
  ],
  Accounting: [
    'Accounting suits people who value accuracy, rules, and trustworthy financial records.',
    'This field fits detail-oriented thinkers who like clear standards and audits.',
    'You may enjoy balancing precision with judgment in regulated environments.',
    'Steady routines and careful checks are central to doing well here.'
  ],
  Finance: [
    'Finance fits those who enjoy markets, risk thinking, and strategic money decisions.',
    'This field suits analytical minds who also handle pressure and client trust.',
    'You may enjoy blending numbers with persuasion and long-term planning.',
    'Clear reasoning and ethical judgment both matter in these roles.'
  ],
  Humanities: [
    'Humanities-related paths suit reflective people who enjoy ideas, culture, and people.',
    'This field fits strong readers and communicators who like nuance and context.',
    'You may enjoy helping others make sense of complex social or personal questions.',
    'Curiosity about meaning and language often shows up in strong matches.'
  ],
  Design: [
    'Design suits creative individuals who enjoy visual expression and user-centered choices.',
    'This field fits if you like shaping how things look, feel, and flow for people.',
    'You may thrive when imagination meets constraints and feedback loops.',
    'Many designers enjoy prototyping, taste, and clarity as much as originality.'
  ],
  Media: [
    'Media paths suit expressive people who enjoy stories, audiences, and timely messaging.',
    'This field fits if you like crafting narratives and adapting tone for different channels.',
    'You may enjoy fast cycles, collaboration, and making ideas spread responsibly.',
    'Curiosity about culture and public conversation helps a lot here.'
  ],
  Networking: [
    'Networking and infrastructure roles suit people who like reliable systems and uptime.',
    'This field fits hands-on troubleshooters who enjoy connectivity and security basics.',
    'You may enjoy diagnosing issues and designing dependable technical foundations.',
    'Patience with configuration and documentation shows up often in strong matches.'
  ],
  Marketing: [
    'Marketing suits people who enjoy positioning products, campaigns, and customer insight.',
    'This field fits creative-influential types who like measurable experiments.',
    'You may enjoy blending messaging with analytics to see what resonates.',
    'Energy for outreach and brand storytelling matters alongside strategy.'
  ],
  Law: [
    'Law-related paths suit structured thinkers who enjoy argument, research, and ethics.',
    'This field fits if you like clear rules, precedent, and high-stakes communication.',
    'You may enjoy defending positions with evidence and careful language.',
    'Reading closely and advocating fairly are both central here.'
  ],
  'Computer Applications': [
    'Application-focused tech roles suit builders who like shipping useful software.',
    'This field fits if you enjoy end-to-end features, databases, or user-facing tools.',
    'You may like turning requirements into working products people rely on daily.',
    'Practical coding habits and curiosity about user needs both help.'
  ],
  Hospitality: [
    'Hospitality suits warm, service-minded people who enjoy events and guest experience.',
    'This field fits if you like fast-paced teamwork and making others feel welcome.',
    'You may enjoy operations, coordination, and small details that elevate a visit.',
    'Social energy and calm under pressure often show up in strong matches.'
  ]
};

const GENERIC_FIELD_TAILS = [
  'This direction tends to reward the mix of strengths in your profile.',
  'Exploring here can line up well with how your interests combine.',
  'Many people with a similar pattern find this kind of work engaging.',
  'Your blend of top traits often shows up in successful profiles in this area.',
  'This bucket is worth sampling if the day-to-day work sounds appealing.'
];

export function buildFieldExplanation(fieldName, state) {
  const open = buildTopTraitOpening(state, 3);
  const tails = FIELD_EXPLANATION_TAILS[fieldName] || GENERIC_FIELD_TAILS;
  const tail = pickExplanationVariant(`field|${fieldName}`, tails);
  const glue = explanationSeedHash(fieldName) % 2 === 0 ? ' — ' : '. ';
  return `${open}${glue}${tail}`;
}

/** Career-level tails: field-aware + rotated; avoids one repeated sentence for every role */
const CAREER_TAILS_BY_FIELD = {
  Engineering: [
    'This role suits people who enjoy building, testing, and improving physical or technical systems.',
    'You may enjoy this career if you like hands-on problem solving and clear design specs.',
    'This pathway matches an interest in turning drawings or models into real outcomes.',
    'Strong fit when you like steady iteration and responsibility for how things perform.'
  ],
  Tech: [
    'This role suits people who enjoy logic, code, and refining how software behaves.',
    'You may enjoy this career if you like debugging, tools, and collaborative builds.',
    'This pathway matches curiosity about systems, security, or scalable architecture.',
    'A good match when you enjoy learning continuously and shipping reliable features.'
  ],
  'Medical & Health': [
    'This role suits people drawn to care, science, and high-trust service.',
    'You may enjoy this career if you like patient interaction and evidence-based practice.',
    'This pathway matches an interest in health outcomes and structured protocols.',
    'Strong fit when responsibility, empathy, and precision all feel meaningful.'
  ],
  'Data Science': [
    'This role suits people who enjoy models, experiments, and careful interpretation.',
    'You may enjoy this career if you like asking rigorous questions of messy data.',
    'This pathway matches an interest in prediction, evaluation, and honest uncertainty.',
    'A good match when coding and statistical thinking feel natural together.'
  ],
  'Data Analytics': [
    'This role suits people who enjoy metrics, dashboards, and actionable insight.',
    'You may enjoy this career if you like translating numbers into decisions.',
    'This pathway matches structured thinking plus business-facing communication.',
    'Strong fit when you prefer clarity, repeatability, and stakeholder questions.'
  ],
  'Pure & Applied Science': [
    'This role suits people who enjoy inquiry, methods, and deep specialization.',
    'You may enjoy this career if you like lab, field, or computational discovery.',
    'This pathway matches patience with hypotheses, evidence, and peer review.',
    'A good match when curiosity outweighs the need for immediate certainty.'
  ],
  'Business & Management': [
    'This role suits people who enjoy aligning teams, plans, and outcomes.',
    'You may enjoy this career if you like negotiation, prioritization, and execution.',
    'This pathway matches influence paired with operational awareness.',
    'Strong fit when you like making trade-offs visible and accountable.'
  ],
  Accounting: [
    'This role suits people who enjoy precision, standards, and financial integrity.',
    'You may enjoy this career if you like reconciling detail with big-picture compliance.',
    'This pathway matches methodical work and trustworthy reporting.',
    'A good match when rules, checks, and accuracy feel satisfying.'
  ],
  Finance: [
    'This role suits people who enjoy markets, strategy, and measured risk.',
    'You may enjoy this career if you like analysis plus client or stakeholder trust.',
    'This pathway matches structured thinking about money and incentives.',
    'Strong fit when you handle pressure with clear reasoning and ethics.'
  ],
  Humanities: [
    'This role suits reflective people who enjoy writing, dialogue, or human insight.',
    'You may enjoy this career if you like nuance, ethics, and helping others think.',
    'This pathway matches curiosity about behavior, culture, or policy.',
    'A good match when language and empathy are tools you like using daily.'
  ],
  Design: [
    'This role suits people who enjoy creativity and shaping how users experience products.',
    'You may enjoy this career if you like visual craft, feedback, and iteration.',
    'This pathway matches an interest in aesthetics paired with practical constraints.',
    'Strong fit when prototyping and clarity matter as much as ideas.'
  ],
  Media: [
    'This role suits expressive people who enjoy stories, channels, and timing.',
    'You may enjoy this career if you like shaping messages for different audiences.',
    'This pathway matches energy for content, reputation, and public conversation.',
    'A good match when adaptability and voice both feel like strengths.'
  ],
  Networking: [
    'This role suits people who enjoy reliable networks, security, and infrastructure.',
    'You may enjoy this career if you like troubleshooting connectivity at scale.',
    'This pathway matches hands-on systems work with clear operational goals.',
    'Strong fit when documentation and prevention feel as important as fixes.'
  ],
  Marketing: [
    'This role suits people who enjoy campaigns, positioning, and customer curiosity.',
    'You may enjoy this career if you like creative tests with measurable results.',
    'This pathway matches persuasion paired with structured experiments.',
    'A good match when brand, channel, and insight all feel interesting.'
  ],
  Law: [
    'This role suits structured thinkers who enjoy research, advocacy, and rules.',
    'You may enjoy this career if you like building arguments from careful evidence.',
    'This pathway matches patience with process and high-stakes communication.',
    'Strong fit when precision with language feels professionally rewarding.'
  ],
  'Computer Applications': [
    'This role suits builders who enjoy applications people use every day.',
    'You may enjoy this career if you like full-stack thinking or specialized platforms.',
    'This pathway matches practical coding with user or business needs in mind.',
    'A good match when shipping maintainable software feels motivating.'
  ],
  Hospitality: [
    'This role suits service-minded people who enjoy guest experience and events.',
    'You may enjoy this career if you like fast teamwork and memorable moments.',
    'This pathway matches warmth, coordination, and operational detail.',
    'Strong fit when people skills and calm under pressure show up for you.'
  ]
};

const GENERIC_CAREER_TAILS = [
  (open, fieldLabel, dominantFocus) =>
    `${open}. This role suits people who enjoy ${dominantFocus} in professional settings.`,
  (open, fieldLabel, dominantFocus) =>
    `${open}. You may enjoy this career if you like work that leans toward ${dominantFocus}.`,
  (open, fieldLabel, dominantFocus) =>
    `${open} — a pathway that often rewards ${dominantFocus} alongside ${fieldLabel}-style challenges.`,
  (open, fieldLabel, dominantFocus) =>
    `${open}. This type of role is a fit when ${dominantFocus} sounds energizing day to day.`,
  (open, fieldLabel, dominantFocus) =>
    `${open}. Consider this path if you like combining your strengths with typical ${fieldLabel} tasks.`,
  (open, fieldLabel, dominantFocus) =>
    `${open}. Many in ${fieldLabel} find satisfaction when their work emphasizes ${dominantFocus}.`
];

function combineOpenWithCareerDetail(open, detailSentence, comboKey) {
  const d = detailSentence.trim();
  const canReorder = open.startsWith('Based on');
  const mode = explanationSeedHash(comboKey) % 3;
  if (!canReorder || mode === 0) return `${open}. ${d}`;
  if (mode === 1) return `${d} ${open.charAt(0).toLowerCase()}${open.slice(1)}.`;
  return `${open} — ${d}`;
}

/**
 * @param {string} title - Career title
 * @param {object} state - normalized RIASEC state
 * @param {string} [fieldName] - Parent field (for context + de-duplication of wording)
 */
export function buildCareerExplanation(title, state, fieldName = '') {
  const open = buildTopTraitOpening(state, 3);
  const key = `career|${fieldName}|${title}`;
  const lines = getWhyLinesForTitle(title);
  const dominantFocus = STRENGTH_FOCUS[state.dominantCode] || 'balanced professional strengths';
  const fieldLabel = fieldName || 'this';

  if (lines.length >= 1) {
    const dbDetail = lines
      .slice(0, 2)
      .map((s) => String(s).trim())
      .filter(Boolean)
      .join(' and ');
    return combineOpenWithCareerDetail(open, dbDetail, `${key}|db`);
  }

  const fieldTails = CAREER_TAILS_BY_FIELD[fieldName];
  if (fieldTails?.length) {
    const tail = pickExplanationVariant(key, fieldTails);
    return combineOpenWithCareerDetail(open, tail, `${key}|field`);
  }

  const gen = pickExplanationVariant(key, GENERIC_CAREER_TAILS);
  return gen(open, fieldLabel, dominantFocus);
}

// ─── Career-level score inside a field ───────────────────────────────────

/**
 * UI label for how well a career matches (uses same scale as career scorePercent).
 * @param {number} scorePercent
 * @returns {"Best Fit" | "Good Fit" | "Explore"}
 */
export function getCareerFitTag(scorePercent) {
  const p = Number(scorePercent);
  if (Number.isNaN(p)) return 'Explore';
  if (p >= 75) return 'Best Fit';
  if (p >= 50) return 'Good Fit';
  return 'Explore';
}

export function scoreCareerInField(title, fieldName, fieldScore, maxFieldScore, state, fieldWeightsMap) {
  const maxF = Math.max(maxFieldScore, 1e-9);
  const normField = fieldScore / maxF;
  const traitAlign = computeCareerTraitAlignment(title, state.normalized, fieldName, fieldWeightsMap);
  const combined = FIELD_WEIGHT_IN_CAREER * normField + TRAIT_WEIGHT_IN_CAREER * traitAlign;
  return { score: combined, traitAlign, normField };
}

export function buildRankedCareersForField(fieldName, fieldScore, state, fieldScoreMap, fieldWeightsMap) {
  const cfg = FIELDS_CONFIG[fieldName];
  const titles = [...(cfg?.careerPaths || [])];
  const maxField = Math.max(...Object.values(fieldScoreMap), 1e-9);

  const careers = titles.map((title) => {
    const { score } = scoreCareerInField(title, fieldName, fieldScore, maxField, state, fieldWeightsMap);
    const scorePercent = Math.round(score * 1000) / 10;
    return {
      title,
      score,
      scorePercent,
      careerFitTag: getCareerFitTag(scorePercent),
      explanation: buildCareerExplanation(title, state, fieldName)
    };
  });

  careers.sort((a, b) => {
    if (!scoresEffectivelyEqual(a.score, b.score)) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });

  return careers;
}

// ─── Confidence ────────────────────────────────────────────────────────────

export function assessConfidence(state, raw, flatProfile, veryLowEngagement) {
  if (veryLowEngagement) {
    return { confidence: 'Low', message: RIASEC_CONFIDENCE_EXPLANATION_LOW };
  }

  if (flatProfile) {
    return { confidence: 'Low', message: RIASEC_CONFIDENCE_EXPLANATION_LOW };
  }

  const s0 = state.sortedDims[0]?.score ?? 0;
  const s1 = state.sortedDims[1]?.score ?? 0;
  const topTwoGap = s0 - s1;

  if (topTwoGap >= CONFIDENCE_CONFIG.HIGH_GAP) {
    return { confidence: 'High', message: RIASEC_CONFIDENCE_EXPLANATION_HIGH };
  }

  return { confidence: 'Moderate', message: RIASEC_CONFIDENCE_EXPLANATION_MODERATE };
}

/**
 * When RIASEC dimensions exist, use engine confidence so UI/PDF match getFieldRecommendations.
 * @returns {{ level: string, explanation: string } | null}
 */
export function getRiasecConfidenceForDisplay(dimensions) {
  if (!isValidDimensionsInput(dimensions)) return null;
  const analysis = getFieldRecommendations(dimensions);
  const level = String(analysis.confidence || '').toUpperCase();
  const explanation = analysis.confidenceMessage || '';
  if (!level || !explanation) return null;
  return { level, explanation };
}

function emptyAnalysisResult(message) {
  const raw = Object.fromEntries(RIASEC_CODES.map((c) => [c, 0]));
  const state = normalizeRiasecScores(raw);
  return {
    valid: false,
    confidence: 'Low',
    confidenceMessage: message || 'RIASEC data is missing or invalid.',
    edgeCase: 'invalid_input',
    state,
    fieldScoreMap: {},
    rankedFields: [],
    topFields: [],
    pathwayRows: [],
    flatProfile: false,
    veryLowEngagement: true
  };
}

/**
 * @param {Array<{ code: string, score?: number }>|Record<string, number>} dimensions
 */
export function getFieldRecommendations(dimensions, options = {}) {
  const topFieldLimit = options.topFieldLimit ?? 3;
  const pathwayColumns = options.pathwayColumns ?? 3;

  if (!isValidDimensionsInput(dimensions)) {
    return emptyAnalysisResult('RIASEC dimensions are missing or invalid.');
  }

  const raw = parseRiasecInput(dimensions);
  const totalRaw = rawTotal(raw);
  const maxDim = maxRawDimension(raw);
  const veryLowEngagement =
    totalRaw < CONFIDENCE_CONFIG.LOW_TOTAL_THRESHOLD ||
    (maxDim < CONFIDENCE_CONFIG.LOW_MAX_DIMENSION_RAW &&
      totalRaw < CONFIDENCE_CONFIG.LOW_TOTAL_THRESHOLD * 1.5);

  const state = normalizeRiasecScores(raw);
  const flatProfile = isFlatNormalizedProfile(state.normalized);
  const fieldWeightsMap = getFieldWeightsRecord();
  const fieldScoreMap = computeFieldScoreMap(state);
  const maxFieldScore = Math.max(...Object.values(fieldScoreMap), 1e-9);

  const { confidence, message: confidenceMessage } = assessConfidence(
    state,
    raw,
    flatProfile,
    veryLowEngagement
  );

  let rankedFields = Object.entries(fieldScoreMap)
    .map(([field, score]) => ({ field, score }))
    .sort((a, b) => {
      if (!scoresEffectivelyEqual(a.score, b.score)) return b.score - a.score;
      return a.field.localeCompare(b.field);
    });

  if (flatProfile) {
    rankedFields = [...rankedFields].sort((a, b) => a.field.localeCompare(b.field));
  }

  const topFields = rankedFields.slice(0, topFieldLimit).map(({ field, score }) => {
    const careers = buildRankedCareersForField(field, score, state, fieldScoreMap, fieldWeightsMap);
    const cfg = FIELDS_CONFIG[field];
    return {
      field,
      score,
      scorePercent: Math.round(score * 1000) / 10,
      explanation: buildFieldExplanation(field, state),
      careerPaths: [...(cfg?.careerPaths || [])],
      careers
    };
  });

  const aspiringFieldsData = buildCareerPathwaysData();
  const mapping = RIASEC_CAREER_FIELDS_MAPPING;

  const sortedDimensions = RIASEC_CODES.map((code) => ({
    code,
    score: raw[code] || 0
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.code.localeCompare(b.code);
  });

  const pathwayRows = sortedDimensions.map(({ code, score }) => {
    let mappedFieldNames = mapping[code] || [];
    if (flatProfile) {
      mappedFieldNames = [...mappedFieldNames].sort((x, y) => x.localeCompare(y));
    }

    const sortFields = (a, b) => {
      if (!scoresEffectivelyEqual(a.finalScore, b.finalScore)) return b.finalScore - a.finalScore;
      return a.aspiringField.localeCompare(b.aspiringField);
    };

    let fieldsForDimension = mappedFieldNames
      .map((fieldName) => {
        const fieldData = aspiringFieldsData.find((item) => item.aspiringField === fieldName);
        if (!fieldData) return null;
        const fs = fieldScoreMap[fieldData.aspiringField] || 0;
        const careers = buildRankedCareersForField(
          fieldData.aspiringField,
          fs,
          state,
          fieldScoreMap,
          fieldWeightsMap
        );
        return {
          aspiringField: fieldData.aspiringField,
          careerPaths: fieldData.careerPaths || [],
          careers,
          weight: fieldWeightsMap[fieldData.aspiringField]?.[code] || 0,
          finalScore: fs,
          matchScorePercent: Math.round(fs * 1000) / 10,
          explanation: buildFieldExplanation(fieldData.aspiringField, state)
        };
      })
      .filter(Boolean)
      .sort(sortFields);

    const rowPolicy = PATHWAY_ROW_FIELD_POLICY[code];
    if (rowPolicy?.mustIncludeField) {
      const pinnedField = fieldsForDimension.find((f) => f.aspiringField === rowPolicy.mustIncludeField);
      if (pinnedField) {
        const top = fieldsForDimension.slice(0, pathwayColumns);
        if (!top.some((f) => f.aspiringField === rowPolicy.mustIncludeField)) {
          const withoutPinned = fieldsForDimension.filter(
            (f) => f.aspiringField !== rowPolicy.mustIncludeField
          );
          fieldsForDimension = [...withoutPinned.slice(0, pathwayColumns - 1), pinnedField].sort(sortFields);
        } else {
          fieldsForDimension = top;
        }
      } else {
        fieldsForDimension = fieldsForDimension.slice(0, pathwayColumns);
      }
    } else {
      fieldsForDimension = fieldsForDimension.slice(0, pathwayColumns);
    }

    return {
      riasecCode: code,
      riasecScore: Math.round(Math.max(0, score)),
      fields: fieldsForDimension
    };
  });

  const allCareers = rankedFields.flatMap(({ field, score }) =>
    buildRankedCareersForField(field, score, state, fieldScoreMap, fieldWeightsMap).map((c) => ({
      ...c,
      field
    }))
  );
  allCareers.sort((a, b) => {
    if (!scoresEffectivelyEqual(a.score, b.score)) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });

  return {
    valid: true,
    confidence,
    confidenceMessage,
    edgeCase: veryLowEngagement ? 'low_engagement' : flatProfile ? 'flat_profile' : null,
    state,
    fieldScoreMap,
    rankedFields,
    topFields,
    pathwayRows,
    flatProfile,
    veryLowEngagement,
    rankedCareersGlobal: allCareers.slice(0, 12)
  };
}
