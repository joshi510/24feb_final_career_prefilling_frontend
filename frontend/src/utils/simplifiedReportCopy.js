/**
 * Simple English labels and phrase replacements for student/counsellor-facing reports.
 * Display-only — no scoring logic.
 */

/** Longest phrases first so partial overlaps don’t break replacements */
const PHRASE_REPLACEMENTS = [
  [
    'The student is currently in an exploration stage. This means it is too early to finalize a career decision.',
    'It is too early to choose a career right now. Keep exploring first.'
  ],
  [
    'The student shows low readiness with developing aptitude. Career decisions should be delayed for 12-18 months while strengthening verbal and numerical skills through guided preparation and exploration.',
    'This student needs more time before choosing a career. Focus on exploring interests and building basic skills first.'
  ],
  [
    'Making a career decision without guidance at this stage may increase the risk of course changes or dissatisfaction later. This is decision risk, not failure risk - it means the student needs more time to explore before committing.',
    'Choosing a career too early can cause problems later. Take more time to explore and get guidance first.'
  ],
  [
    'Making a career decision at this stage may increase the chances of course changes or loss of interest later. This is decision risk, not failure risk - it means the student needs more time to explore before committing.',
    'Choosing a career too early can cause problems later. Take more time to explore and get guidance first.'
  ],
  [
    'This direction is based on early aptitude patterns and should be treated as a starting point for exploration, not a final decision. The student needs more time to develop clarity before committing to any career path.',
    'These career suggestions are a starting point only. The student needs more time to explore before making a final decision.'
  ],
  [
    'An existing foundation of knowledge to build upon, as evidenced by correct answers in various sections.',
    'You already know some things well — that is a good start.'
  ],
  [
    'A proactive step taken by completing the assessment, demonstrating engagement with career planning.',
    'You completed this assessment — that shows you are thinking about your future.'
  ],
  [
    'Identified specific areas for targeted skill enhancement, providing a clear development pathway.',
    'You now know which areas to improve — this gives you a clear path forward.'
  ],
  [
    'Comprehensive skill development is needed across multiple career readiness domains.',
    'Several areas need more practice. This is completely normal at this stage.'
  ],
  [
    'Opportunities to strengthen foundational knowledge and practical application in all assessed areas.',
    'Work on building your basic skills step by step.'
  ],
  [
    'What this report means: This assessment provides insights into the student\'s current career exploration stage, strengths, and areas for development. The results are based on the student\'s responses and reflect their current level of readiness for career decision-making.',
    'What this report means: This report shows the student\'s personality type, strengths, and best-fit career areas based on their answers.'
  ],
  [
    "What this report means: This assessment provides insights into the student's current career exploration stage, strengths, and areas for development. The results are based on the student's responses and reflect their current level of readiness for career decision-making.",
    "What this report means: This report shows the student's personality type, strengths, and best-fit career areas based on their answers."
  ],
  [
    'What this report does NOT mean: This is not a test of intelligence or ability. A lower score does not indicate failure or lack of potential. It simply means the student is in an earlier stage of career exploration and needs more time to develop clarity.',
    'What this report does NOT mean: This is not an intelligence test. A lower score does not mean failure. It just means the student needs more time to explore.'
  ],
  [
    'Next steps: The roadmap provided in this report offers a clear path forward. Work with a qualified career counsellor to understand these results better and create a personalized plan. Remember, career development is a journey, not a destination.',
    'Next steps: Talk to a career counsellor to understand these results better and make a plan.'
  ],
  [
    'This assessment is designed to provide general career guidance and insights. Results are intended for informational purposes only and should not be considered as definitive career decisions or professional diagnoses. We strongly recommend consulting with a qualified career counsellor to discuss these results in detail.',
    'This report gives general career guidance only. Please talk to a qualified career counsellor for detailed advice.'
  ],
  [
    'This profile shows a strong preference for tangible, practical activities. Individuals often demonstrate an aptitude for working with tools, machinery, or the outdoors.',
    'You enjoy practical, hands-on activities. You are good at working with tools, machines, or outdoor tasks.'
  ],
  [
    'Individuals with high Investigative inclinations tend to approach problems with a thoughtful, analytical mindset. They often enjoy exploring complex theories and seeking in-depth understanding.',
    'You like to think carefully and solve problems. You enjoy learning how things work in detail.'
  ],
  [
    'Individuals scoring highly in Artistic dimensions often demonstrate a strong drive for self-expression. They typically value aesthetics and innovation in their pursuits.',
    'You enjoy creative work and expressing yourself. You value originality and new ideas.'
  ],
  [
    'Developing preferences for supporting and interacting with others are indicated. Individuals may find satisfaction in collaborative settings or roles that involve assistance.',
    'You enjoy helping and working with people. You feel satisfied when you support others.'
  ],
  [
    'Early indicators suggest limited interest in activities involving leadership, persuasion, or direct business influence. Preferences lean away from highly competitive or entrepreneurial roles.',
    'You prefer to work independently rather than lead or persuade others. Competitive environments may not suit you.'
  ],
  [
    'Minimal interest is noted in highly structured, routine, or detailed organizational tasks. There is a general preference for environments that are less constrained by strict procedures.',
    'You prefer flexible work over strict routines and detailed record-keeping.'
  ],
  ['Skill building in foundational areas', 'Work on basic skills'],
  ['Domain exploration through counselling', 'Explore careers with a counsellor'],
  ['Career awareness sessions', 'Attend career awareness sessions'],
  ['Basic aptitude improvement activities', 'Practice basic aptitude skills'],
  ['Final specialization', 'Choose your specialization'],
  ['Career commitment decisions', 'Make your final career choice'],
  ['Avoid final career decisions at this stage', 'Do not make a final career choice yet'],
  ['Focus on exploration and foundation skills', 'Focus on exploring different careers'],
  ['Career counselling is strongly recommended', 'Talk to a career counsellor'],
  ['Competitive exam preparation should be delayed', 'Wait before starting exam preparation'],
  ['Build awareness before specialization', 'Learn about different careers first'],
  ['Making a career decision now without further exploration may lead to course dissatisfaction or switching later.', 'Choosing a career too early can cause problems later. Take more time to explore and get guidance first.'],
  ['With guidance and preparation, career decisions can become more reliable. Rushing may limit future options.', 'Take your time and get guidance before you decide.'],
  [
    'The student is currently in an exploration stage. This means it is too early to finalise a career decision.',
    'It is too early to choose a career right now. Keep exploring first.'
  ]
];

/** Strip legacy readiness boilerplate if exact phrase match missed */
const EXPLORATION_STAGE_LEGACY =
  /\bThe student is currently in an exploration stage\.\s*This means it is too early to (finalize|finalise) a career decision\.?\s*/gi;

/** Canonical short advice — shown once in Career Readiness / Decision Guidance; stripped from other sections */
export const CHOOSING_ADVICE_SNIPPET =
  'Choosing a career too early can cause problems later. Take more time to explore and get guidance first.';
export const READINESS_ADVICE_SNIPPET =
  'It is too early to choose a career right now. Keep exploring first.';

const SNIPPETS_DEDUPE_ONCE = [CHOOSING_ADVICE_SNIPPET, READINESS_ADVICE_SNIPPET];

/** Remove every repeat of `snippet` after the first (handles "A. A." and non-adjacent duplicates). */
function dedupeAllButFirstGlobal(text, snippet) {
  if (!text || !snippet || !text.includes(snippet)) return text;
  const esc = snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(esc, 'g');
  let seen = false;
  return text
    .replace(re, () => {
      if (!seen) {
        seen = true;
        return snippet;
      }
      return ' ';
    })
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();
}

function dedupeKnownSnippets(s) {
  let t = s;
  for (const snippet of SNIPPETS_DEDUPE_ONCE) {
    t = dedupeAllButFirstGlobal(t, snippet);
  }
  return t.replace(/\s+/g, ' ').trim();
}

const LABEL_REPLACEMENTS = [
  ['PERSONALIZED ANALYSIS', 'ABOUT YOU'],
  ['Personalized Analysis', 'About You'],
  ['Work-Style Preferences', 'Best Work Environment'],
  ['Work Style Preferences', 'Best Work Environment'],
  ['Core Strengths', 'Your Strengths'],
  ['Key Strengths', 'Your Strengths'],
  ['TOP QUALITIES', 'YOUR STRONG POINTS'],
  ['Behavioral Strengths', 'Your Strong Points'],
  ['DECISION RISK', 'CAREER READINESS'],
  ['Decision Risk', 'Career Readiness'],
  ['RIASEC Dimensions Overview', 'Your Personality Types'],
  ['Detailed Dimension Analysis', 'What Each Type Means For You'],
  ['RIASEC Dimension', 'Personality Type'],
  ['Pathway field & example roles', 'Career Path'],
  ['Pathway field &amp; example roles', 'Career Path'],
  ['Career Areas & Jobs', 'Career Path'],
  ['Career Direction Confidence:', 'Career Direction:'],
  ['Confidence Level', 'Clarity Level'],
  ['Career Readiness Assessment', 'Are You Ready to Choose a Career?'],
  ['Your Career Readiness Assessment', 'Are You Ready to Choose a Career?'],
  ['Career Confidence Indicator', 'How Clear Is Your Career Direction?'],
  ['Readiness Action Guidance', 'What To Do Next'],
  ['Career Readiness & Decision Guidance', 'Career readiness and guidance'],
  ['Action Items', 'Your Next Steps'],
  ['Section Scores Breakdown', 'Your Scores'],
  ['Counsellor Summary', 'Counsellor Notes'],
  ['Key Takeaway', 'What This Means'],
  ['Dominant Types:', 'Your Top Types:'],
  ['Secondary Influence:', 'Also Strong:'],
  ['Confidence: Moderate', 'Match Strength: Medium'],
  ['Confidence: High', 'Match Strength: High'],
  ['Confidence: Low', 'Match Strength: Low'],
  ['HIGH MATCH', 'GREAT FIT'],
  ['MODERATE MATCH', 'GOOD FIT'],
  ['LOW MATCH', 'SOME FIT'],
  ['High Match', 'Great Fit'],
  ['Moderate Match', 'Good Fit'],
  ['Low Match', 'Some Fit'],
  ['High Risk', 'Needs More Guidance'],
  ['Moderate Risk', 'Getting Clearer'],
  ['Low Risk', 'Good to Go'],
  ['Requires Guided Decision-Making', 'Needs Counsellor Help'],
  ['Exploration Stage', 'Still Exploring'],
  ['Preparation Stage', 'Getting Ready'],
  ['Low Decision Risk', 'Lower need for guidance'],
  ['Stability: Developing', 'Still Building Skills'],
  ['Fields and individual roles ranked for your profile — with plain-language reasons', 'Career path that matches your personality'],
  ['Career areas and jobs that match your personality', 'Career path that matches your personality']
];

export function simplifyReportText(input) {
  if (input == null) return input;
  // Normalize so API text (smart quotes, en dashes, extra whitespace) still matches replacements
  let s = String(input)
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-');
  for (const [from, to] of PHRASE_REPLACEMENTS) {
    if (s.includes(from)) {
      s = s.split(from).join(to);
    }
  }
  for (const [from, to] of LABEL_REPLACEMENTS) {
    if (s.includes(from)) {
      s = s.split(from).join(to);
    }
  }
  s = s.replace(EXPLORATION_STAGE_LEGACY, '').replace(/\s+/g, ' ').trim();
  s = dedupeKnownSnippets(s);
  return s;
}

/**
 * Risk fields sometimes duplicate the same advice in `risk_explanation_human` and `risk_explanation`.
 * Merge, then simplify + dedupe so Decision Guidance shows one block of text.
 */
export function simplifyRiskExplanationDisplay(human, machine) {
  const h = String(human || '').trim();
  const m = String(machine || '').trim();
  if (h && m) {
    if (h === m) return simplifyReportText(h);
    if (h.includes(m)) return simplifyReportText(h);
    if (m.includes(h)) return simplifyReportText(m);
    return simplifyReportText(`${h} ${m}`);
  }
  return simplifyReportText(h || m);
}

/**
 * Remove both core advice sentences from text (after full simplify).
 * Use for "What To Do Next", Do Now/Later, career direction blurb — avoids repeating the same lines shown in Readiness/Decision cards.
 */
export function removeCoreAdviceSentencesFromSecondaryText(raw) {
  let s = simplifyReportText(raw);
  for (const snippet of SNIPPETS_DEDUPE_ONCE) {
    const esc = snippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(esc, 'g'), ' ');
  }
  return s
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();
}

/** Filter list items that would only repeat core readiness/risk advice */
export function filterSecondaryReportLinesRemovingCoreAdvice(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((x) => removeCoreAdviceSentencesFromSecondaryText(String(x || '')))
    .filter((line) => line.length >= 4);
}

export function simplifyReportLines(list) {
  if (!Array.isArray(list)) return list;
  return list.map((x) => simplifyReportText(typeof x === 'string' ? x : String(x)));
}

/** API readiness codes → friendly short label */
export function friendlyReadinessLabel(status) {
  if (status === 'READY') return 'Ready for Career Planning';
  if (status === 'PARTIALLY READY') return 'Getting Ready';
  return 'Still Exploring';
}

/** Risk level from interpretation (LOW/MEDIUM/HIGH) — simple English for students */
export function friendlyRiskLabel(risk) {
  const u = String(risk || '').toUpperCase();
  if (u === 'LOW') return 'Good to Go';
  if (u === 'MEDIUM' || u === 'MODERATE') return 'Getting Clearer';
  return 'Needs More Guidance';
}

/** career_confidence_level from API */
export function friendlyCareerDirectionHeadline(level) {
  const u = String(level || '').toUpperCase();
  if (u === 'HIGH') return 'Career Direction: Clear';
  if (u === 'MODERATE') return 'Career Direction: Getting Clearer';
  return 'Career Direction: Still Unclear';
}

/** reportEngine pathway confidence: Moderate / High / Low */
export function formatPathwayMatchStrength(confidence) {
  const c = String(confidence || '').trim();
  if (/high/i.test(c)) return 'Match Strength: High';
  if (/moderate|medium/i.test(c)) return 'Match Strength: Medium';
  if (/low/i.test(c)) return 'Match Strength: Low';
  return simplifyReportText(c);
}

/** RIASEC PDF/UI tier from score thresholds */
export function matchTierToDisplayLabel(tier) {
  const t = String(tier || '').toUpperCase();
  if (t === 'HIGH') return 'Great Fit';
  if (t === 'MODERATE') return 'Good Fit';
  return 'Some Fit';
}

/** riasecProfile.decisionRisk.level from API */
export function mapDecisionRiskLevelDisplay(level) {
  const s = String(level || '');
  if (s.includes('High')) return 'Needs More Guidance';
  if (s.includes('Moderate')) return 'Getting Clearer';
  if (s.includes('Low')) return 'Good to Go';
  return simplifyReportText(s);
}

/**
 * Admin analytics: internal readiness bucket keys stay in API/state;
 * use this only for chart labels, tooltips, and insight copy.
 */
export function readinessAnalyticsDisplayLabel(internalKey) {
  const k = String(internalKey || '');
  if (k === 'NOT READY') return 'Still Exploring';
  if (k === 'PARTIALLY READY') return 'Getting Clearer';
  if (k === 'READY') return 'Good to Go';
  return k;
}

export function mapStabilityDisplay(stability) {
  const s = String(stability || '');
  if (/developing/i.test(s)) return 'Still Building Skills';
  return s;
}

/** PDF + KeyTakeaway narrative */
export function keyTakeawayMessage(readinessStatus) {
  if (readinessStatus === 'NOT READY') {
    return 'You are doing well. Keep exploring — do not rush into a final decision yet.';
  }
  if (readinessStatus === 'PARTIALLY READY') {
    return 'You are on the right path, but this is a preparation phase, not a final decision stage.';
  }
  return 'You are on the right path, and this is a good time to explore specific career options with guidance.';
}
