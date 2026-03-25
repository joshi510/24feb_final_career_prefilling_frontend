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
  business_intelligence_analyst: {
    after10th: ['Commerce / Science — strengthen Maths and logical reasoning'],
    after12th: ['BCom / BBA / BCA / B.Tech + Excel, SQL, and reporting tools'],
    afterGraduation: ['BI tool certifications, domain analytics, MBA optional'],
    alternativePath: ['Excel + SQL + Power BI / Tableau + dashboard portfolio']
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
  tax_auditor: {
    after10th: ['Commerce — accounting and tax awareness'],
    after12th: ['BCom + tax or audit exposure; CA Foundation route'],
    afterGraduation: ['CA / CMA or specialized tax certifications'],
    alternativePath: ['Articleship / tax advisory firms + GST and direct tax study']
  },
  forensic_accountant: {
    after10th: ['Commerce — strong accounting fundamentals'],
    after12th: ['BCom; CA / CMA pathway often used'],
    afterGraduation: ['Forensic accounting / fraud examination certifications'],
    alternativePath: ['Audit or investigation practice + specialized courses']
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
  police_officer: {
    after10th: ['Any stream — fitness, discipline, and general awareness'],
    after12th: ['Graduation (often required) + state police recruitment exam prep'],
    afterGraduation: ['Departmental promotions and specialized in-service training'],
    alternativePath: ['Physical tests prep + coaching for state PSC / police recruitment']
  },
  defence_officer: {
    after10th: ['Science (PCM) for technical entries; build fitness early'],
    after12th: ['NDA / technical entries after 12th, or graduation for CDS / AFCAT'],
    afterGraduation: ['Academy training and service specialization'],
    alternativePath: ['SSB preparation + medical fitness focus']
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
  },
  ai_engineer: {
    after10th: ['Science (PCM) — strong Maths and logical thinking'],
    after12th: ['B.Tech in CS / AI / related branch through JEE or state counselling'],
    afterGraduation: ['M.Tech / PG in AI or ML-focused programmes'],
    alternativePath: ['BCA / B.Sc CS + online ML projects and a solid portfolio']
  },
  animator: {
    after10th: ['Any stream — drawing and storytelling basics'],
    after12th: ['Animation diploma or B.Des / related degree'],
    afterGraduation: ['Studio specialisation or advanced animation courses'],
    alternativePath: ['Short-term animation courses + strong demo reel']
  },
  architect: {
    after10th: ['Science with Maths — spatial and drawing skills'],
    after12th: ['B.Arch through NATA / JEE Paper 2 or state-level architecture exam'],
    afterGraduation: ['Council registration prep and practice under a firm'],
    alternativePath: ['Diploma in architecture assistantship then lateral degree where available']
  },
  biotechnologist: {
    after10th: ['Science (PCB) — strong biology and chemistry'],
    after12th: ['B.Tech / B.Sc Biotechnology'],
    afterGraduation: ['M.Sc / M.Tech Biotech or research-oriented PG'],
    alternativePath: ['Quality / lab trainee roles + part-time higher study']
  },
  career_counsellor: {
    after10th: ['Any stream — communication and listening skills'],
    after12th: ['BA / B.Sc in Psychology, Education, or related field'],
    afterGraduation: ['PG diploma in guidance / counselling; supervised practice hours'],
    alternativePath: ['Certified counselling skills programme + school / centre volunteering']
  },
  civil_engineer: {
    after10th: ['Science (PCM)'],
    after12th: ['B.Tech Civil through JEE or state engineering counselling'],
    afterGraduation: ['GATE / M.Tech or site / design roles with experience'],
    alternativePath: ['Diploma in Civil + lateral entry to B.Tech']
  },
  content_creator: {
    after10th: ['Any stream — writing, speaking, or visual interest'],
    after12th: ['Any UG + skills in editing, scripting, or design tools'],
    afterGraduation: ['Short courses in digital media or brand storytelling'],
    alternativePath: ['Consistent posting + niche portfolio; small brand collaborations']
  },
  database_administrator: {
    after10th: ['Science or Commerce — comfort with logic and detail'],
    after12th: ['BCA / B.Sc IT / B.Tech with database subjects'],
    afterGraduation: ['DB admin or cloud data certifications'],
    alternativePath: ['IT support role + SQL practice and internal DBA mentoring']
  },
  electrician: {
    after10th: ['Science or skill-focused stream; ITI route is common'],
    after12th: ['ITI Electrician; optional diploma for higher study'],
    afterGraduation: ['Wireman / supervisor licences as per state rules'],
    alternativePath: ['Apprenticeship under a licensed contractor']
  },
  entrepreneur: {
    after10th: ['Any stream — problem-solving and basic money sense'],
    after12th: ['BBA / B.Com / any degree + small real projects'],
    afterGraduation: ['MBA or incubator / startup support programmes'],
    alternativePath: ['Family business + formal short course in accounts and marketing']
  },
  environmental_consultant: {
    after10th: ['Science — environment and geography awareness'],
    after12th: ['B.Sc Environmental Science / related applied science'],
    afterGraduation: ['M.Sc / PG in environment management or policy'],
    alternativePath: ['Field surveys + NGO internship + compliance training']
  },
  event_coordinator: {
    after10th: ['Any stream — organisation and people skills'],
    after12th: ['Diploma or degree in event / media / hospitality'],
    afterGraduation: ['Senior roles via large events and vendor networks'],
    alternativePath: ['Assist local planners; build a photo / vendor portfolio']
  },
  event_manager: {
    after10th: ['Any stream — leadership and time management'],
    after12th: ['BBA / hotel or event management programme'],
    afterGraduation: ['MBA events / marketing or large-format event experience'],
    alternativePath: ['Start with college fests and small corporate gigs']
  },
  ev_technician: {
    after10th: ['Science or ITI — hands-on interest'],
    after12th: ['ITI / diploma in auto or electrical trades + EV short modules'],
    afterGraduation: ['OEM service training or advanced diploma'],
    alternativePath: ['Workshop apprenticeship focusing on batteries and motors']
  },
  fashion_designer: {
    after10th: ['Any stream — sketching and fabric sense'],
    after12th: ['NIFT / NID / reputed fashion or textile programme'],
    afterGraduation: ['Brand or export house experience; specialised design PG'],
    alternativePath: ['Diploma + tailoring unit + online sales trial']
  },
  game_designer: {
    after10th: ['Any stream — games, art, or coding interest'],
    after12th: ['B.Sc / diploma in game design, animation, or CS'],
    afterGraduation: ['Studio pipeline training or PG in interactive media'],
    alternativePath: ['Indie game jams + free engines + public builds']
  },
  geologist: {
    after10th: ['Science (PCM / PCB as per course) — field curiosity'],
    after12th: ['B.Sc Geology / applied geology'],
    afterGraduation: ['M.Sc Geology; survey / mining / environment roles'],
    alternativePath: ['Field assistant jobs + distance M.Sc while working']
  },
  hardware_engineer: {
    after10th: ['Science (PCM)'],
    after12th: ['B.Tech ECE / EEE / related'],
    afterGraduation: ['Embedded or PCB design courses; product company roles'],
    alternativePath: ['Diploma electronics + repair bench to design upskilling']
  },
  healthcare_administrator: {
    after10th: ['Science or Commerce — organised and people-friendly'],
    after12th: ['BHA / BBA hospital admin or related UG'],
    afterGraduation: ['MHA / MBA hospital or health management'],
    alternativePath: ['Front-desk or records role in a hospital + evening PG diploma']
  },
  hotel_manager: {
    after10th: ['Any stream — service mindset'],
    after12th: ['BHM / hotel management degree or diploma'],
    afterGraduation: ['Operations or F&B leadership track in chains'],
    alternativePath: ['Front office trainee + internal promotion with certifications']
  },
  hr_manager: {
    after10th: ['Any stream — people and communication skills'],
    after12th: ['BBA / B.Com / BA + HR or psychology papers'],
    afterGraduation: ['MBA HR or PGDHRM; labour law basics'],
    alternativePath: ['Recruitment executive role + part-time HR diplomas']
  },
  interior_designer: {
    after10th: ['Any stream — space and colour sense'],
    after12th: ['Diploma or B.Des / B.Sc interior design'],
    afterGraduation: ['Council registration where needed; firm experience'],
    alternativePath: ['Assist a senior designer + software skills for drawings']
  },
  investment_banker: {
    after10th: ['Commerce or Science — strong Maths and English'],
    after12th: ['Top commerce / economics / engineering UG where possible'],
    afterGraduation: ['MBA finance from reputed school; equity research / analyst entry'],
    alternativePath: ['CA / CFA track + internships in finance teams']
  },
  it_support_technician: {
    after10th: ['Any stream — curiosity about computers'],
    after12th: ['BCA / B.Sc IT / diploma in IT support'],
    afterGraduation: ['Vendor certs for OS, networks, or cloud basics'],
    alternativePath: ['Helpdesk job + night classes in troubleshooting']
  },
  journalist: {
    after10th: ['Any stream — reading and clear writing'],
    after12th: ['BA Journalism / mass communication / related'],
    afterGraduation: ['PG diploma or digital newsroom specialisation'],
    alternativePath: ['Local paper / web portal internship + mobile reporting skills']
  },
  lab_technician: {
    after10th: ['Science — careful with numbers and safety'],
    after12th: ['DMLT / B.Sc MLT or related diploma'],
    afterGraduation: ['Hospital lab senior grades or quality courses'],
    alternativePath: ['Private lab trainee + bridge course to recognised qualification']
  },
  legal_consultant: {
    after10th: ['Any stream — reading and debate'],
    after12th: ['5-year BA LLB or 3-year LLB after UG'],
    afterGraduation: ['Practice in contracts, compliance, or company law'],
    alternativePath: ['Paralegal or LPO experience + focused law certificates']
  },
  market_research_analyst: {
    after10th: ['Commerce or Science — Maths and curiosity about people'],
    after12th: ['BBA / B.Com / B.Sc with statistics or economics'],
    afterGraduation: ['MBA marketing / analytics or market research PG diploma'],
    alternativePath: ['Survey fieldwork + Excel and presentation skills; grow in agencies']
  },
  materials_scientist: {
    after10th: ['Science (PCM)'],
    after12th: ['B.Tech Materials / Metallurgy / related or B.Sc Physics-Chemistry'],
    afterGraduation: ['M.Tech / M.Sc + R&D or quality labs'],
    alternativePath: ['Industry trainee in testing lab + higher study part-time']
  },
  mechanical_engineer: {
    after10th: ['Science (PCM)'],
    after12th: ['B.Tech Mechanical through JEE or state counselling'],
    afterGraduation: ['GATE / M.Tech or plant / design experience'],
    alternativePath: ['Diploma Mechanical + lateral B.Tech']
  },
  mobile_app_developer: {
    after10th: ['Science or computer interest — logic practice'],
    after12th: ['BCA / B.Tech with programming papers'],
    afterGraduation: ['Mobile platform certifications and shipped apps'],
    alternativePath: ['Strong GitHub apps + freelance small business projects']
  },
  operations_analyst: {
    after10th: ['Commerce or Science — organised thinking'],
    after12th: ['BBA / B.Com / B.Tech + Excel and process basics'],
    afterGraduation: ['Lean / Six Sigma intro; analytics tools for ops'],
    alternativePath: ['Operations trainee + online process improvement courses']
  },
  operations_manager: {
    after10th: ['Any stream — planning and team coordination'],
    after12th: ['BBA / B.Com / B.Tech'],
    afterGraduation: ['MBA operations or supply chain'],
    alternativePath: ['Shift supervisor / executive track in logistics or manufacturing']
  },
  photographer: {
    after10th: ['Any stream — visual sense'],
    after12th: ['BA / diploma in photography or self-taught with basics'],
    afterGraduation: ['Wedding / product / media house specialisation'],
    alternativePath: ['Assist a studio; build Instagram / portfolio site']
  },
  pilot: {
    after10th: ['Science (PCM) — medical fitness early check'],
    after12th: ['CPL training at DGCA-approved flying school after 12th'],
    afterGraduation: ['Type rating and airline selection processes'],
    alternativePath: ['Class 1 medical first; plan costs and flying hours clearly']
  },
  portfolio_manager: {
    after10th: ['Commerce or Science — Maths comfort'],
    after12th: ['B.Com / BBA / economics-heavy UG'],
    afterGraduation: ['MBA finance / CFA levels; equity research or wealth desk'],
    alternativePath: ['Mutual fund / bank RM desk + AMFI and NISM certificates']
  },
  research_scientist: {
    after10th: ['Science — deep interest in one subject'],
    after12th: ['B.Sc in core science or integrated science UG'],
    afterGraduation: ['M.Sc / PhD; CSIR-NET or institute projects'],
    alternativePath: ['Project assistant in lab + publish with guide support']
  },
  robotics_engineer: {
    after10th: ['Science (PCM)'],
    after12th: ['B.Tech Mech / ECE / CS with robotics clubs'],
    afterGraduation: ['M.Tech robotics / automation or industry R&D'],
    alternativePath: ['Competitions and kits + internship in automation SME']
  },
  sales_manager: {
    after10th: ['Any stream — confidence and ethics'],
    after12th: ['BBA / B.Com / any UG'],
    afterGraduation: ['MBA sales / marketing'],
    alternativePath: ['Field sales job + target achievement record']
  },
  social_worker: {
    after10th: ['Any stream — empathy and patience'],
    after12th: ['BSW — Bachelor of Social Work'],
    afterGraduation: ['MSW and NGO / government scheme roles'],
    alternativePath: ['Volunteer full-time + bridge to formal BSW']
  },
  supply_chain_manager: {
    after10th: ['Commerce or Science — planning skills'],
    after12th: ['BBA / B.Com / B.Tech + logistics exposure'],
    afterGraduation: ['MBA operations / supply chain'],
    alternativePath: ['Warehouse or procurement executive + professional certifications']
  },
  systems_engineer: {
    after10th: ['Science (PCM)'],
    after12th: ['B.Tech with systems / IT integration subjects'],
    afterGraduation: ['Cloud or integration certifications'],
    alternativePath: ['IT implementation projects + mentor under senior integrator']
  },
  tourism_director: {
    after10th: ['Any stream — languages and people skills'],
    after12th: ['BTTM / BHM / tourism management degree'],
    afterGraduation: ['Senior roles in travel companies or state tourism bodies'],
    alternativePath: ['Tour guide licence + grow into operations']
  },
  tourism_manager: {
    after10th: ['Any stream — geography and communication'],
    after12th: ['Degree in travel / tourism / hospitality'],
    afterGraduation: ['Destination or airline partnership roles'],
    alternativePath: ['Travel agency floor + IATA-style short courses']
  },
  video_editor: {
    after10th: ['Any stream — patience with software'],
    after12th: ['Diploma / degree in media, film, or mass communication'],
    afterGraduation: ['Post-production house specialisation'],
    alternativePath: ['YouTube / wedding edits + online editing courses']
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
