/**
 * Single source of truth for pathway fields (buckets) used by the career engine.
 * Each field: weights (sum 1.0), careerPaths, riasecDimensions (UI / grouping).
 */

export const FIELDS_CONFIG = {
  Engineering: {
    weights: { R: 0.4, I: 0.35, C: 0.15, A: 0.05, S: 0.03, E: 0.02 },
    careerPaths: ['Civil Engineer', 'Mechanical Engineer', 'Robotics Engineer'],
    riasecDimensions: ['R']
  },
  Tech: {
    weights: { I: 0.35, R: 0.25, C: 0.2, A: 0.1, E: 0.05, S: 0.05 },
    careerPaths: ['Software Developer', 'Cybersecurity Analyst', 'Cloud Architect'],
    riasecDimensions: ['I', 'R']
  },
  'Medical & Health': {
    weights: { S: 0.35, I: 0.3, C: 0.15, R: 0.1, E: 0.05, A: 0.05 },
    careerPaths: ['Medical Doctor', 'Registered Nurse', 'Healthcare Administrator'],
    riasecDimensions: ['S']
  },
  'Data Science': {
    weights: { I: 0.45, A: 0.2, C: 0.15, R: 0.1, E: 0.05, S: 0.05 },
    careerPaths: ['Machine Learning Engineer', 'Data Scientist', 'AI Research Scientist'],
    riasecDimensions: ['I']
  },
  'Data Analytics': {
    weights: { I: 0.35, C: 0.3, E: 0.15, A: 0.1, S: 0.05, R: 0.05 },
    careerPaths: ['Business Intelligence Analyst', 'Operations Analyst', 'Market Research Analyst'],
    riasecDimensions: ['I', 'C']
  },
  'Pure & Applied Science': {
    weights: { I: 0.4, R: 0.35, C: 0.15, A: 0.05, S: 0.03, E: 0.02 },
    careerPaths: [
      'Geologist',
      'Materials Scientist',
      'Lab Technician',
      'Research Scientist',
      'Biotechnologist',
      'Environmental Consultant'
    ],
    riasecDimensions: ['R', 'I']
  },
  'Business & Management': {
    weights: { E: 0.4, C: 0.25, S: 0.2, I: 0.1, A: 0.03, R: 0.02 },
    careerPaths: ['Project Manager', 'Operations Manager', 'Management Consultant'],
    riasecDimensions: ['E']
  },
  Accounting: {
    weights: { C: 0.5, I: 0.2, E: 0.15, S: 0.1, R: 0.03, A: 0.02 },
    careerPaths: ['Certified Public Accountant', 'Forensic Accountant', 'Tax Auditor'],
    riasecDimensions: ['C']
  },
  Finance: {
    weights: { E: 0.35, C: 0.3, I: 0.2, S: 0.1, A: 0.03, R: 0.02 },
    careerPaths: ['Investment Banker', 'Financial Planner', 'Portfolio Manager'],
    riasecDimensions: ['C']
  },
  Humanities: {
    weights: { S: 0.35, A: 0.3, I: 0.2, E: 0.1, C: 0.03, R: 0.02 },
    careerPaths: ['Psychologist', 'Technical Writer', 'Policy Analyst'],
    riasecDimensions: ['A', 'S']
  },
  Design: {
    weights: { A: 0.45, I: 0.25, E: 0.15, S: 0.1, C: 0.03, R: 0.02 },
    careerPaths: ['UX/UI Designer', 'Graphic Designer', 'Industrial Designer'],
    riasecDimensions: ['A']
  },
  Media: {
    weights: { A: 0.35, E: 0.3, S: 0.2, I: 0.1, C: 0.03, R: 0.02 },
    careerPaths: ['Content Producer', 'Public Relations Specialist', 'Digital Editor'],
    riasecDimensions: ['A']
  },
  Networking: {
    weights: { I: 0.35, R: 0.3, C: 0.2, E: 0.1, A: 0.03, S: 0.02 },
    careerPaths: [
      'Network Engineer',
      'Solutions Architect',
      'Network Security Engineer',
      'Systems Administrator',
      'IT Infrastructure Manager'
    ],
    riasecDimensions: ['I', 'R']
  },
  Marketing: {
    weights: { E: 0.4, A: 0.25, S: 0.2, I: 0.1, C: 0.03, R: 0.02 },
    careerPaths: ['Digital Marketing Manager', 'Brand Strategist', 'Social Media Director'],
    riasecDimensions: ['E']
  },
  Law: {
    weights: { E: 0.35, I: 0.25, C: 0.2, S: 0.15, A: 0.03, R: 0.02 },
    careerPaths: ['Corporate Attorney', 'Legal Consultant', 'Paralegal'],
    riasecDimensions: ['E']
  },
  'Computer Applications': {
    weights: { I: 0.3, R: 0.3, C: 0.2, A: 0.1, E: 0.05, S: 0.05 },
    careerPaths: [
      'Hardware Engineer',
      'IT Support Technician',
      'Systems Engineer',
      'Web Developer',
      'Mobile App Developer',
      'Database Administrator'
    ],
    /** R listed first in careerPaths + R before I here so R-dominant roles pin under Realistic (see pickWinningPlacementForCareer) */
    riasecDimensions: ['R', 'I']
  },
  Hospitality: {
    weights: { S: 0.4, E: 0.3, A: 0.15, C: 0.1, I: 0.03, R: 0.02 },
    careerPaths: ['Hotel Manager', 'Event Coordinator', 'Tourism Director'],
    riasecDimensions: ['S']
  }
};

/** Canonical RIASEC dimension order for loops and mapping keys */
export const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C'];

/** Derived list for lookups — single derivation from FIELDS_CONFIG */
export function buildCareerPathwaysData() {
  return Object.entries(FIELDS_CONFIG).map(([name, cfg]) => ({
    aspiringField: name,
    careerPaths: cfg.careerPaths
  }));
}

/** RIASEC letter → field names (from each field’s riasecDimensions only — no duplicate hardcoding) */
export function buildRiasecFieldMapping() {
  const acc = Object.fromEntries(RIASEC_CODES.map((code) => [code, []]));
  Object.entries(FIELDS_CONFIG).forEach(([fieldName, cfg]) => {
    cfg.riasecDimensions.forEach((code) => {
      if (acc[code]) acc[code].push(fieldName);
    });
  });
  return acc;
}

/**
 * RIASEC letter → pathway field order for grids. `A` order ensures Humanities appears with Design & Media.
 * Other letters match buildRiasecFieldMapping().
 */
export const RIASEC_CAREER_FIELDS_MAPPING = {
  ...buildRiasecFieldMapping(),
  A: ['Design', 'Media', 'Humanities']
};

export function getFieldWeightsRecord() {
  return Object.fromEntries(
    Object.entries(FIELDS_CONFIG).map(([field, cfg]) => [field, cfg.weights])
  );
}
