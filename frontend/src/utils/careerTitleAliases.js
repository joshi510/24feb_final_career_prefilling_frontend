const TITLE_ALIASES = new Map([
  // Client wording (UI-only). Keep internal IDs/titles unchanged for algorithm stability.
  ['Investment Banker', 'Banker'],
  ['Chartered Accountant', 'Accountant'],
  ['Tax Auditor', 'Auditor'],
  ['HR Manager', 'HR Professional'],
  ['Digital Marketing Manager', 'Marketing Executive'],
  ['Teacher', 'Teacher / Professor'],
  ['Doctor', 'Doctor / Medical Professional'],
  // Technician grouping used in client list
  ['EV Technician', 'Technician'],
  ['IT Support Technician', 'Technician'],
  ['Lab Technician', 'Technician'],
]);

/**
 * UI-only display alias for client-facing titles.
 * Never use this for scoring, matching, or ID resolution.
 */
export function aliasCareerTitleForDisplay(title) {
  const t = String(title || '').trim();
  if (!t) return '';
  return TITLE_ALIASES.get(t) || t;
}

