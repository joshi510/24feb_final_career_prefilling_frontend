/**
 * India-focused pathway guidance by career id.
 * Layer C (HOW): independent from RIASEC scoring logic.
 */

export const CAREER_PATHWAYS = {
  software_developer: {
    after10th: ['Choose Science/Computer in 11th-12th and start coding basics'],
    after12th: ['B.Tech / BE (CS/IT) through JEE or state counselling', 'BCA / BSc IT + coding projects'],
    afterGraduation: ['MCA or job-focused certifications (full-stack, backend, cloud)'],
    alternativePath: ['Diploma + lateral entry', 'Online courses + strong GitHub projects']
  },
  web_developer: {
    after10th: ['Build HTML/CSS/JS basics with simple websites'],
    after12th: ['BCA / BSc IT / B.Tech + frontend and backend practice'],
    afterGraduation: ['Specialize in React/Node and deployment'],
    alternativePath: ['Online bootcamps + portfolio projects + internships']
  },
  data_analyst: {
    after10th: ['Focus on Maths and basic spreadsheet skills'],
    after12th: ['BSc / BCom / BCA + Excel, SQL, Power BI'],
    afterGraduation: ['PG in Analytics or industry certifications'],
    alternativePath: ['Self-learning + real dashboard portfolio']
  },
  data_scientist: {
    after10th: ['Choose Maths-focused stream and build logic skills'],
    after12th: ['B.Tech / BSc in CS, Statistics, Maths', 'Learn Python + statistics early'],
    afterGraduation: ['MSc / PG in Data Science or ML specialization'],
    alternativePath: ['Certifications + capstone projects + Kaggle portfolio']
  },
  machine_learning_engineer: {
    after10th: ['Strengthen Maths and problem-solving'],
    after12th: ['B.Tech CS/AI through JEE/state route', 'Learn Python and ML foundations'],
    afterGraduation: ['Advanced ML/NLP/CV specialization'],
    alternativePath: ['Online ML tracks + production ML projects']
  },
  ai_research_scientist: {
    after10th: ['Build strong Maths and science basics'],
    after12th: ['B.Tech / BSc in CS/Maths/AI'],
    afterGraduation: ['MTech / MSc / research-oriented AI programs'],
    alternativePath: ['Research internships + open-source research projects']
  },
  cybersecurity_analyst: {
    after10th: ['Start networking and security basics'],
    after12th: ['BCA / BSc IT / B.Tech + cybersecurity labs'],
    afterGraduation: ['Security certifications (CEH, Security+) and SOC training'],
    alternativePath: ['CTFs + bug bounty + practical labs']
  },
  cloud_architect: {
    after10th: ['Build Linux and networking fundamentals'],
    after12th: ['B.Tech / BCA / BSc IT + cloud basics'],
    afterGraduation: ['AWS/Azure/GCP architect certifications'],
    alternativePath: ['Cloud projects + DevOps portfolio']
  },
  network_engineer: {
    after10th: ['Choose science or technical stream and basic networking'],
    after12th: ['Diploma/B.Tech/BSc IT + CCNA-level preparation'],
    afterGraduation: ['Advanced networking/security certifications'],
    alternativePath: ['NOC internships + lab-based certification tracks']
  },
  systems_administrator: {
    after10th: ['Learn computer hardware and operating systems basics'],
    after12th: ['Diploma / BSc IT / BCA + Linux and Windows admin'],
    afterGraduation: ['Server, cloud and automation certifications'],
    alternativePath: ['IT support roles -> sysadmin growth path']
  },
  solutions_architect: {
    after10th: ['Build strong analytical and system-thinking habits'],
    after12th: ['B.Tech / BCA and focus on software architecture basics'],
    afterGraduation: ['Cloud architecture and enterprise system certifications'],
    alternativePath: ['Developer -> senior engineer -> architect pathway']
  },
  it_infrastructure_manager: {
    after10th: ['Build practical understanding of hardware/networking'],
    after12th: ['Diploma / degree in IT + system administration exposure'],
    afterGraduation: ['Infra/cloud operations specialization'],
    alternativePath: ['Start in support/NOC and move into infra leadership']
  },
  network_security_engineer: {
    after10th: ['Focus on networking fundamentals and logical reasoning'],
    after12th: ['IT degree/diploma + network security basics'],
    afterGraduation: ['Security certs + hands-on SOC/network defense'],
    alternativePath: ['Certifications + practical labs + internships']
  },
  ux_designer: {
    after10th: ['Build creativity and basic digital design skills'],
    after12th: ['BDes / BSc / BCA + UI/UX tools and case studies'],
    afterGraduation: ['UX research and product design specialization'],
    alternativePath: ['Portfolio-first path via online design programs']
  },
  graphic_designer: {
    after10th: ['Start with drawing, typography and visual basics'],
    after12th: ['Design degree/diploma or skill-based design programs'],
    afterGraduation: ['Branding, motion or product design specialization'],
    alternativePath: ['Freelance portfolio + agency internships']
  },
  industrial_designer: {
    after10th: ['Strengthen creativity with practical model-making'],
    after12th: ['BDes/Design exams (UCEED/NID routes) where relevant'],
    afterGraduation: ['Product design specialization'],
    alternativePath: ['Design diploma + strong portfolio projects']
  },
  digital_marketer: {
    after10th: ['Practice writing, communication and basic digital tools'],
    after12th: ['Any degree + digital marketing fundamentals'],
    afterGraduation: ['SEO/SEM/performance marketing specialization'],
    alternativePath: ['Certifications + freelance campaigns + portfolio']
  },
  brand_strategist: {
    after10th: ['Build communication and creative thinking'],
    after12th: ['BBA/BCom/BA + marketing basics'],
    afterGraduation: ['Brand management specialization'],
    alternativePath: ['Agency internships + campaign case portfolio']
  },
  social_media_director: {
    after10th: ['Learn content creation and audience engagement basics'],
    after12th: ['Any degree + digital content and analytics skills'],
    afterGraduation: ['Advanced social strategy and growth marketing'],
    alternativePath: ['Freelance/social media handling portfolio']
  },
  business_analyst: {
    after10th: ['Focus on maths, logic and communication'],
    after12th: ['BBA/BCom/BCA/BTech + analytics tools'],
    afterGraduation: ['BA/PM certifications and domain specialization'],
    alternativePath: ['Data + business reporting projects']
  },
  product_manager: {
    after10th: ['Build leadership, communication and problem-solving'],
    after12th: ['Engineering/BBA/BCom + product thinking exposure'],
    afterGraduation: ['Product management certifications/roles'],
    alternativePath: ['Start as analyst/developer then move to product']
  },
  chartered_accountant: {
    after10th: ['Strong commerce and accounting fundamentals'],
    after12th: ['Commerce stream + CA Foundation route'],
    afterGraduation: ['CA Intermediate + Articleship + Final'],
    alternativePath: ['BCom + CMA/CS or finance certifications']
  },
  financial_planner: {
    after10th: ['Build maths and financial awareness'],
    after12th: ['BCom/BBA/finance-related graduation'],
    afterGraduation: ['Financial planning certifications'],
    alternativePath: ['Banking/insurance roles -> planning specialization']
  },
  lawyer: {
    after10th: ['Build reading, logic and debate skills'],
    after12th: ['5-year integrated law through CLAT/other law entrance'],
    afterGraduation: ['3-year LLB route after graduation'],
    alternativePath: ['Paralegal/legal process support roles']
  },
  paralegal: {
    after10th: ['Strengthen reading and documentation skills'],
    after12th: ['Legal diploma / BA LLB pathway support roles'],
    afterGraduation: ['Paralegal certification and legal drafting specialization'],
    alternativePath: ['Legal process outsourcing entry roles']
  },
  doctor: {
    after10th: ['Choose Science (PCB) and build biology foundation'],
    after12th: ['MBBS through NEET'],
    afterGraduation: ['MD/MS specialization'],
    alternativePath: ['Allied health tracks (physio, nursing, lab science)']
  },
  nurse: {
    after10th: ['Choose science/health-oriented subjects'],
    after12th: ['BSc Nursing / GNM pathway'],
    afterGraduation: ['Specialized nursing certifications'],
    alternativePath: ['Hospital assistant -> formal nursing qualification']
  },
  physiotherapist: {
    after10th: ['Build biology interest and communication'],
    after12th: ['BPT after 12th science'],
    afterGraduation: ['MPT specialization'],
    alternativePath: ['Sports rehab certifications + internships']
  },
  teacher: {
    after10th: ['Build subject strength and communication'],
    after12th: ['UG in chosen subject'],
    afterGraduation: ['B.Ed and state eligibility exams where needed'],
    alternativePath: ['EdTech tutoring + teaching certifications']
  },
  psychologist: {
    after10th: ['Build empathy and communication habits'],
    after12th: ['BA/BSc Psychology after 12th'],
    afterGraduation: ['MA/MSc Psychology and supervised practice'],
    alternativePath: ['Counselling certifications + guided internships']
  }
};

export const DEFAULT_PATHWAY = {
  after10th: ['Choose a stream aligned to this career and build core basics'],
  after12th: ['Select a related degree/diploma and build practical projects'],
  afterGraduation: ['Take specialization courses and internships'],
  alternativePath: ['Online certifications + portfolio projects + mentorship']
};

export function getCareerPathwayById(careerId) {
  return CAREER_PATHWAYS[careerId] || DEFAULT_PATHWAY;
}

export function getVisiblePathwaySections(studentLevel = '12th', pathway) {
  const level = String(studentLevel || '12th').toLowerCase();
  const out = [];
  if (level === '10th') {
    if (pathway.after10th?.length) out.push({ label: 'After 10th', items: pathway.after10th });
    if (pathway.after12th?.length) out.push({ label: 'After 12th', items: pathway.after12th });
  } else if (level === 'ug') {
    if (pathway.afterGraduation?.length) out.push({ label: 'After Graduation', items: pathway.afterGraduation });
  } else {
    if (pathway.after12th?.length) out.push({ label: 'After 12th', items: pathway.after12th });
  }
  if (pathway.alternativePath?.length) out.push({ label: 'Alternative Path', items: pathway.alternativePath });
  return out;
}
