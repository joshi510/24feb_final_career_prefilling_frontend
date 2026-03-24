/**
 * Career catalog: weighted RIASEC traits (sum ≈ 1 per row), cluster, and static rationale bullets.
 */

import { RIASEC_CODES } from './fieldsConfig.js';

/**
 * Maps each career `cluster` to a FIELDS_CONFIG key (pathway field for conflict-weighted scoring).
 */
export const CLUSTER_TO_PATHWAY_FIELD = {
  'Data & AI': 'Data Science',
  Data: 'Data Analytics',
  AI: 'Tech',
  Tech: 'Tech',
  Business: 'Business & Management',
  Marketing: 'Marketing',
  Design: 'Design',
  Media: 'Media',
  Engineering: 'Engineering',
  Technical: 'Computer Applications',
  Healthcare: 'Medical & Health',
  Law: 'Law',
  Education: 'Humanities',
  Finance: 'Finance',
  Sales: 'Marketing',
  Management: 'Business & Management',
  Hospitality: 'Hospitality',
  Creative: 'Design',
  'Creative Tech': 'Tech',
  Social: 'Humanities',
  Government: 'Law',
  Aviation: 'Engineering',
  'Pure & Applied Science': 'Pure & Applied Science',
  'Computer Applications': 'Computer Applications',
  'Medical & Health': 'Medical & Health',
  'Data Analytics': 'Data Analytics',
  Networking: 'Networking'
};

const DEFAULT_PATHWAY_FALLBACK = 'Business & Management';

export function resolvePathwayField(cluster) {
  const key = CLUSTER_TO_PATHWAY_FIELD[cluster];
  return key || DEFAULT_PATHWAY_FALLBACK;
}

export const careerDatabase = [
  {
    id: 'data_scientist',
    name: 'Data Scientist',
    traits: { I: 0.6, C: 0.4 },
    cluster: 'Data & AI',
    why: ['Strong analytical thinking', 'Works with structured data']
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Data',
    why: ['Analyzing patterns', 'Detail-oriented work']
  },
  {
    id: 'ai_engineer',
    name: 'AI Engineer',
    traits: { I: 0.55, R: 0.45 },
    cluster: 'AI',
    why: ['Problem solving', 'Technical systems']
  },
  {
    id: 'software_developer',
    name: 'Software Developer',
    traits: { I: 0.55, R: 0.45 },
    cluster: 'Tech',
    why: ['Logical thinking', 'Building systems']
  },
  {
    id: 'cybersecurity_analyst',
    name: 'Cybersecurity Analyst',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Tech',
    why: ['Attention to detail', 'System protection']
  },
  {
    id: 'network_engineer',
    name: 'Network Engineer',
    traits: { I: 0.5, R: 0.5 },
    cluster: 'Networking',
    why: ['Technical troubleshooting', 'Hands-on systems']
  },
  {
    id: 'it_infrastructure_manager',
    name: 'IT Infrastructure Manager',
    traits: { R: 0.5, I: 0.3, C: 0.2 },
    cluster: 'Networking',
    why: ['Manages network infrastructure', 'Keeps systems running smoothly']
  },
  {
    id: 'network_security_engineer',
    name: 'Network Security Engineer',
    traits: { R: 0.5, I: 0.3, C: 0.2 },
    cluster: 'Networking',
    why: ['Protects network systems', 'Combines security with technical skills']
  },
  {
    id: 'systems_administrator',
    name: 'Systems Administrator',
    traits: { R: 0.45, I: 0.35, C: 0.2 },
    cluster: 'Networking',
    why: ['Manages and maintains computer systems', 'Keeps servers and networks running smoothly']
  },
  {
    id: 'solutions_architect',
    name: 'Solutions Architect',
    traits: { I: 0.45, R: 0.3, E: 0.15, C: 0.1 },
    cluster: 'Networking',
    why: ['Designs technical solutions for business problems', 'Bridges technology and business strategy']
  },

  {
    id: 'product_manager',
    name: 'Product Manager',
    traits: { E: 0.35, I: 0.35, S: 0.3 },
    cluster: 'Business',
    why: ['Leadership', 'Problem solving', 'Team collaboration']
  },
  {
    id: 'business_analyst',
    name: 'Business Analyst',
    traits: { I: 0.4, C: 0.35, E: 0.25 },
    cluster: 'Business',
    why: ['Analysis', 'Structured thinking', 'Business decisions']
  },
  {
    id: 'hr_manager',
    name: 'HR Manager',
    traits: { S: 0.55, E: 0.45 },
    cluster: 'Business',
    why: ['People interaction', 'Leadership']
  },
  {
    id: 'operations_manager',
    name: 'Operations Manager',
    traits: { E: 0.4, C: 0.35, R: 0.25 },
    cluster: 'Business',
    why: ['Execution', 'Structure', 'Practical work']
  },
  {
    id: 'digital_marketer',
    name: 'Digital Marketing Manager',
    traits: { E: 0.4, A: 0.35, S: 0.25 },
    cluster: 'Marketing',
    why: ['Creativity', 'Communication', 'Strategy']
  },

  {
    id: 'ux_designer',
    name: 'UX Designer',
    traits: { A: 0.4, I: 0.35, S: 0.25 },
    cluster: 'Design',
    why: ['Creativity', 'User understanding', 'Problem solving']
  },
  { id: 'graphic_designer', name: 'Graphic Designer', traits: { A: 1 }, cluster: 'Design', why: ['Visual creativity'] },
  {
    id: 'video_editor',
    name: 'Video Editor',
    traits: { A: 0.55, C: 0.45 },
    cluster: 'Media',
    why: ['Creative editing', 'Attention to detail']
  },
  {
    id: 'content_creator',
    name: 'Content Creator',
    traits: { A: 0.4, E: 0.35, S: 0.25 },
    cluster: 'Media',
    why: ['Creativity', 'Audience engagement']
  },

  {
    id: 'mechanical_engineer',
    name: 'Mechanical Engineer',
    traits: { R: 0.5, I: 0.5 },
    cluster: 'Engineering',
    why: ['Hands-on problem solving', 'Machines']
  },
  {
    id: 'civil_engineer',
    name: 'Civil Engineer',
    traits: { R: 0.5, C: 0.5 },
    cluster: 'Engineering',
    why: ['Practical work', 'Structured execution']
  },
  {
    id: 'robotics_engineer',
    name: 'Robotics Engineer',
    traits: { R: 0.5, I: 0.5 },
    cluster: 'Engineering',
    why: ['Automation', 'Systems']
  },
  { id: 'ev_technician', name: 'EV Technician', traits: { R: 1 }, cluster: 'Technical', why: ['Hands-on work'] },
  {
    id: 'electrician',
    name: 'Electrician',
    traits: { R: 0.5, C: 0.5 },
    cluster: 'Technical',
    why: ['Practical work', 'Precision']
  },

  {
    id: 'doctor',
    name: 'Doctor',
    traits: { I: 0.55, S: 0.45 },
    cluster: 'Healthcare',
    why: ['Problem solving', 'Helping people']
  },
  {
    id: 'nurse',
    name: 'Nurse',
    traits: { S: 0.55, R: 0.45 },
    cluster: 'Healthcare',
    why: ['Caregiving', 'Hands-on support']
  },
  {
    id: 'physiotherapist',
    name: 'Physiotherapist',
    traits: { S: 0.55, R: 0.45 },
    cluster: 'Healthcare',
    why: ['Helping people', 'Physical work']
  },

  {
    id: 'lawyer',
    name: 'Lawyer',
    traits: { E: 0.55, I: 0.45 },
    cluster: 'Law',
    why: ['Argumentation', 'Analysis']
  },
  {
    id: 'police_officer',
    name: 'Police Officer',
    traits: { R: 0.4, E: 0.35, S: 0.25 },
    cluster: 'Government',
    why: ['Action', 'Leadership', 'Public interaction']
  },

  {
    id: 'teacher',
    name: 'Teacher',
    traits: { S: 0.55, A: 0.45 },
    cluster: 'Education',
    why: ['Helping others', 'Communication']
  },
  {
    id: 'career_counsellor',
    name: 'Career Counsellor',
    traits: { S: 0.55, I: 0.45 },
    cluster: 'Education',
    why: ['Guiding people', 'Understanding behavior']
  },

  {
    id: 'chartered_accountant',
    name: 'Chartered Accountant',
    traits: { C: 0.55, I: 0.45 },
    cluster: 'Finance',
    why: ['Accuracy', 'Analysis']
  },
  {
    id: 'investment_banker',
    name: 'Investment Banker',
    traits: { E: 0.4, C: 0.35, I: 0.25 },
    cluster: 'Finance',
    why: ['Decision making', 'Structured finance']
  },

  { id: 'entrepreneur', name: 'Entrepreneur', traits: { E: 1 }, cluster: 'Business', why: ['Leadership', 'Risk taking'] },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    traits: { E: 0.55, S: 0.45 },
    cluster: 'Sales',
    why: ['Communication', 'Persuasion']
  },
  {
    id: 'supply_chain_manager',
    name: 'Supply Chain Manager',
    traits: { C: 0.55, E: 0.45 },
    cluster: 'Business',
    why: ['Planning', 'Execution']
  },
  {
    id: 'event_manager',
    name: 'Event Manager',
    traits: { E: 0.55, S: 0.45 },
    cluster: 'Management',
    why: ['Coordination', 'People skills']
  },
  {
    id: 'hotel_manager',
    name: 'Hotel Manager',
    traits: { S: 0.55, E: 0.45 },
    cluster: 'Hospitality',
    why: ['Customer service', 'Management']
  },
  {
    id: 'tourism_manager',
    name: 'Tourism Manager',
    traits: { S: 0.55, E: 0.45 },
    cluster: 'Hospitality',
    why: ['Interaction', 'Planning']
  },

  { id: 'photographer', name: 'Photographer', traits: { A: 1 }, cluster: 'Creative', why: ['Visual creativity'] },
  { id: 'animator', name: 'Animator', traits: { A: 1 }, cluster: 'Creative', why: ['Creative storytelling'] },
  {
    id: 'game_designer',
    name: 'Game Designer',
    traits: { A: 0.55, I: 0.45 },
    cluster: 'Creative Tech',
    why: ['Creativity', 'Logic']
  },
  {
    id: 'journalist',
    name: 'Journalist',
    traits: { S: 0.55, A: 0.45 },
    cluster: 'Media',
    why: ['Communication', 'Storytelling']
  },
  {
    id: 'psychologist',
    name: 'Psychologist',
    traits: { S: 0.55, I: 0.45 },
    cluster: 'Healthcare',
    why: ['Understanding people']
  },
  { id: 'social_worker', name: 'Social Worker', traits: { S: 1 }, cluster: 'Social', why: ['Helping others'] },

  {
    id: 'architect',
    name: 'Architect',
    traits: { A: 0.55, R: 0.45 },
    cluster: 'Design',
    why: ['Design + structure']
  },
  {
    id: 'interior_designer',
    name: 'Interior Designer',
    traits: { A: 1 },
    cluster: 'Design',
    why: ['Creative spaces']
  },
  {
    id: 'fashion_designer',
    name: 'Fashion Designer',
    traits: { A: 1 },
    cluster: 'Design',
    why: ['Creative expression']
  },

  {
    id: 'pilot',
    name: 'Pilot',
    traits: { R: 0.55, C: 0.45 },
    cluster: 'Aviation',
    why: ['Precision', 'Responsibility']
  },
  {
    id: 'defence_officer',
    name: 'Defence Officer',
    traits: { R: 0.5, E: 0.5 },
    cluster: 'Government',
    why: ['Discipline', 'Leadership']
  },

  {
    id: 'geologist',
    name: 'Geologist',
    traits: { R: 0.45, I: 0.35, C: 0.12, E: 0.05, A: 0.02, S: 0.01 },
    cluster: 'Pure & Applied Science',
    why: ['Hands-on field work', 'Studies earth materials and processes', 'Combines outdoor and lab work']
  },
  {
    id: 'materials_scientist',
    name: 'Materials Scientist',
    traits: { R: 0.4, I: 0.38, C: 0.12, E: 0.05, A: 0.03, S: 0.02 },
    cluster: 'Pure & Applied Science',
    why: ['Hands-on lab experimentation', 'Develops new materials for industry', 'Bridges science and engineering']
  },
  {
    id: 'lab_technician',
    name: 'Lab Technician',
    traits: { R: 0.5, I: 0.28, C: 0.15, E: 0.04, A: 0.02, S: 0.01 },
    cluster: 'Pure & Applied Science',
    why: ['Hands-on lab work', 'Supports scientific research', 'Precision and practical skill']
  },
  {
    id: 'research_scientist',
    name: 'Research Scientist',
    traits: { I: 0.55, R: 0.3, C: 0.15 },
    cluster: 'Pure & Applied Science',
    why: ['Conducts experiments to discover new knowledge', 'Pushes boundaries of science and technology']
  },
  {
    id: 'biotechnologist',
    name: 'Biotechnologist',
    traits: { I: 0.5, R: 0.3, C: 0.2 },
    cluster: 'Pure & Applied Science',
    why: ['Applies biology to develop useful products', 'Works at intersection of science and technology']
  },
  {
    id: 'environmental_consultant',
    name: 'Environmental Consultant',
    traits: { I: 0.4, R: 0.3, E: 0.2, C: 0.1 },
    cluster: 'Pure & Applied Science',
    why: ['Advises on environmental impact and sustainability', 'Combines scientific knowledge with practical solutions']
  },

  {
    id: 'industrial_designer',
    name: 'Industrial Designer',
    traits: { A: 0.55, R: 0.45 },
    cluster: 'Design',
    why: ['Designs functional everyday products', 'Combines aesthetics with practical engineering']
  },
  {
    id: 'web_developer',
    name: 'Web Developer',
    traits: { I: 0.55, R: 0.45 },
    cluster: 'Computer Applications',
    why: ['Builds websites and web applications', 'Turns ideas into working digital products']
  },
  {
    id: 'database_administrator',
    name: 'Database Administrator',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Computer Applications',
    why: ['Manages and secures data systems', 'Ensures databases run reliably and efficiently']
  },
  {
    id: 'mobile_app_developer',
    name: 'Mobile App Developer',
    traits: { I: 0.55, R: 0.45 },
    cluster: 'Computer Applications',
    why: ['Builds apps people use every day', 'Combines logic with user-focused design']
  },
  {
    id: 'hardware_engineer',
    name: 'Hardware Engineer',
    traits: { R: 0.55, I: 0.3, C: 0.1, E: 0.03, A: 0.01, S: 0.01 },
    cluster: 'Computer Applications',
    why: ['Designs and builds computer hardware systems', 'Combines electronics with hands-on engineering']
  },
  {
    id: 'it_support_technician',
    name: 'IT Support Technician',
    traits: { R: 0.5, C: 0.25, I: 0.15, S: 0.05, E: 0.03, A: 0.02 },
    cluster: 'Computer Applications',
    why: ['Troubleshoots and fixes technical problems hands-on', 'Keeps computer systems running smoothly']
  },
  {
    id: 'systems_engineer',
    name: 'Systems Engineer',
    traits: { R: 0.45, I: 0.3, C: 0.15, E: 0.05, S: 0.03, A: 0.02 },
    cluster: 'Computer Applications',
    why: ['Designs and manages complex technical systems', 'Bridges hardware and software engineering']
  },
  {
    id: 'brand_strategist',
    name: 'Brand Strategist',
    traits: { A: 0.55, E: 0.45 },
    cluster: 'Marketing',
    why: ['Shapes how people perceive a brand', 'Combines creative thinking with market insight']
  },
  {
    id: 'paralegal',
    name: 'Paralegal',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Law',
    why: ['Supports legal cases with research and documentation', 'Detail-oriented work in a high-stakes environment']
  },
  {
    id: 'event_coordinator',
    name: 'Event Coordinator',
    traits: { S: 0.55, E: 0.45 },
    cluster: 'Hospitality',
    why: ['Plans and executes memorable events', 'Coordinates people, venues, and logistics']
  },
  {
    id: 'tourism_director',
    name: 'Tourism Director',
    traits: { S: 0.55, E: 0.45 },
    cluster: 'Hospitality',
    why: ['Promotes destinations and travel experiences', 'Connects people with cultures and places']
  },
  {
    id: 'healthcare_administrator',
    name: 'Healthcare Administrator',
    traits: { S: 0.55, C: 0.45 },
    cluster: 'Medical & Health',
    why: [
      'Manages healthcare facilities and teams',
      'Ensures patients receive quality care through good systems'
    ]
  },
  {
    id: 'machine_learning_engineer',
    name: 'Machine Learning Engineer',
    traits: { I: 0.55, R: 0.45 },
    cluster: 'Data & AI',
    why: ['Builds and trains AI models', 'Solves complex problems with machine learning']
  },
  {
    id: 'ai_research_scientist',
    name: 'AI Research Scientist',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Data & AI',
    why: ['Pushes boundaries of artificial intelligence', 'Combines deep research with experimental testing']
  },
  {
    id: 'cloud_architect',
    name: 'Cloud Architect',
    traits: { I: 0.55, R: 0.45 },
    cluster: 'Tech',
    why: ['Designs scalable cloud infrastructure', 'Combines technical depth with systems thinking']
  },
  {
    id: 'social_media_director',
    name: 'Social Media Director',
    traits: { E: 0.55, A: 0.45 },
    cluster: 'Marketing',
    why: ['Leads brand presence across social platforms', 'Combines creativity with audience strategy']
  },
  {
    id: 'legal_consultant',
    name: 'Legal Consultant',
    traits: { E: 0.55, I: 0.45 },
    cluster: 'Law',
    why: ['Provides expert legal advice to organisations', 'Combines analytical thinking with practical guidance']
  },
  {
    id: 'market_research_analyst',
    name: 'Market Research Analyst',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Data Analytics',
    why: ['Uncovers consumer insights from data', 'Helps businesses make informed decisions']
  },
  {
    id: 'business_intelligence_analyst',
    name: 'Business Intelligence Analyst',
    traits: { I: 0.55, C: 0.45 },
    cluster: 'Data Analytics',
    why: ['Transforms raw data into business decisions', 'Builds dashboards and reports for leadership']
  },
  {
    id: 'operations_analyst',
    name: 'Operations Analyst',
    traits: { C: 0.55, I: 0.45 },
    cluster: 'Data Analytics',
    why: ['Improves business efficiency through data', 'Identifies operational bottlenecks and solutions']
  },
  {
    id: 'portfolio_manager',
    name: 'Portfolio Manager',
    traits: { E: 0.55, C: 0.45 },
    cluster: 'Finance',
    why: ['Manages investment portfolios for clients', 'Balances risk and return through strategic thinking']
  },
  {
    id: 'financial_planner',
    name: 'Financial Planner',
    traits: { C: 0.55, S: 0.45 },
    cluster: 'Finance',
    why: ['Helps people plan their financial future', 'Combines analytical skills with client trust']
  },
  {
    id: 'forensic_accountant',
    name: 'Forensic Accountant',
    traits: { C: 0.55, I: 0.45 },
    cluster: 'Finance',
    why: ['Investigates financial fraud and irregularities', 'Combines accounting precision with detective thinking']
  },
  {
    id: 'tax_auditor',
    name: 'Tax Auditor',
    traits: { C: 0.55, I: 0.45 },
    cluster: 'Finance',
    why: ['Ensures tax compliance for businesses', 'Detail-oriented work with financial regulations']
  }
];

/** Careers that include each RIASEC code with non-zero weight */
export const careersByRiasecCode = RIASEC_CODES.reduce((acc, code) => {
  acc[code] = careerDatabase.filter((c) => (c.traits[code] ?? 0) > 0);
  return acc;
}, {});
