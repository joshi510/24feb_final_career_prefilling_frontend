/**
 * Human, guidance-oriented reflection prompts for counselling.
 */

import { LOW_AFFINITY_THRESHOLD } from './careerEngine.js';
import { RIASEC_CODES } from '../data/fieldsConfig.js';

const RIASEC_NAMES = {
  R: 'hands-on / practical work',
  I: 'analysis and deep thinking',
  A: 'creativity and originality',
  S: 'working with people and empathy',
  E: 'leadership and persuasion',
  C: 'structure, rules, and accuracy'
};

/**
 * @typedef {{ field: string, careerPaths?: string[] }} TopFieldLike
 */

/**
 * @param {Record<string, number>} normalized
 * @param {string[]} weakCodes
 * @param {TopFieldLike[]} topFields from career engine (pathway areas + sample titles)
 * @param {{ min?: number, max?: number }} [count]
 * @returns {{ id: string, text: string, focus: string }[]}
 */
export function generateCounsellingQuestions(normalized, weakCodes, topFields = [], count = {}) {
  const minQ = count.min ?? 4;
  const maxQ = count.max ?? 6;
  const questions = [];

  const push = (id, text, focus) => {
    if (questions.length >= maxQ) return;
    if (questions.some((q) => q.id === id)) return;
    questions.push({ id, text, focus });
  };

  weakCodes.forEach((code) => {
    const label = RIASEC_NAMES[code] || code;
    if (code === 'S') {
      push(
        'weak_s_collab',
        'When you work on a team project, how do you prefer to contribute — leading discussions, doing research, or executing tasks? What would help you feel more confident in group settings?',
        'Social'
      );
    } else if (code === 'E') {
      push(
        'weak_e_influence',
        'Tell me about a time you had to persuade someone. What felt natural, and what felt uncomfortable?',
        'Enterprising'
      );
    } else if (code === 'C') {
      push(
        'weak_c_detail',
        'How do you feel about detailed checklists, deadlines, and following set procedures — energizing or draining?',
        'Conventional'
      );
    } else if (code === 'A') {
      push(
        'weak_a_create',
        'Do you enjoy open-ended creative problems with no single “right” answer? Where do you usually find ideas?',
        'Artistic'
      );
    } else if (code === 'R') {
      push(
        'weak_r_tools',
        'How much do you enjoy working with tools, machines, or physical tasks compared with mostly screen-based work?',
        'Realistic'
      );
    } else if (code === 'I') {
      push(
        'weak_i_research',
        'When you learn something new, do you prefer reading deeply, experimenting hands-on, or talking it through with someone?',
        'Investigative'
      );
    } else {
      push(`weak_${code}`, `What activities might help you explore ${label} in a low-pressure way?`, code);
    }
  });

  const firstField = topFields[0];
  const sampleTitle = firstField?.careers?.[0]?.title || firstField?.careerPaths?.[0] || firstField?.name;
  if (sampleTitle && (firstField?.field || firstField?.name)) {
    const area = firstField.field || firstField.name;
    push(
      'pathway_fit',
      `Your profile points toward the “${area}” area — for example “${sampleTitle}”. What about that kind of work sounds exciting, and what would you want to learn more about before committing?`,
      'Pathway fit'
    );
  } else if (firstField?.field || firstField?.name) {
    const area = firstField.field || firstField.name;
    push(
      'pathway_area',
      `Results highlight the “${area}” pathway cluster. What would help you decide if that direction is worth a deeper look (courses, conversations, job shadowing)?`,
      'Exploration'
    );
  }

  const secondField = topFields[1];
  const secondName = secondField?.field || secondField?.name;
  if (secondName) {
    push(
      'compare_pathways',
      `You also show fit with “${secondName}”. How different do these two directions feel to you — could one be a “plan A” and the other a backup?`,
      'Comparing options'
    );
  }

  const dominant = [...RIASEC_CODES].sort(
    (a, b) => (normalized[b] || 0) - (normalized[a] || 0)
  )[0];
  if (dominant) {
    push(
      'strength_use',
      `Your strongest theme right now is ${RIASEC_NAMES[dominant]}. Where have you already used that in school, projects, or hobbies — even in small ways?`,
      'Strengths'
    );
  }

  push(
    'values',
    'Aside from interest fit, what matters more to you at this stage: stability, earning potential, helping people, or flexibility?',
    'Values'
  );

  const fallbacks = [
    {
      id: 'open_job_week',
      text: 'If you could try any job for one week with no consequences, what would you pick — and what would you want to learn from it?',
      focus: 'Open exploration'
    },
    {
      id: 'subject_vs_career',
      text: 'Which subject feels easiest or most engaging to you — and does that line up with the careers you are considering?',
      focus: 'Academic clues'
    },
    {
      id: 'mentor',
      text: 'Is there someone whose career you admire? What specifically do you admire — the skills, the lifestyle, or the impact?',
      focus: 'Role models'
    }
  ];
  let fi = 0;
  while (questions.length < minQ && fi < fallbacks.length) {
    const f = fallbacks[fi++];
    push(f.id, f.text, f.focus);
  }

  return questions.slice(0, maxQ);
}

/**
 * @param {{ normalized: Record<string, number> }} state
 * @param {{ topFields?: TopFieldLike[] }} engineSlice
 */
export function buildQuestionsFromProfile(state, engineSlice = {}) {
  const weak = RIASEC_CODES.filter((code) => (state.normalized[code] ?? 0) < LOW_AFFINITY_THRESHOLD);
  return generateCounsellingQuestions(state.normalized, weak, engineSlice.topFields || [], {
    min: 4,
    max: 6
  });
}
