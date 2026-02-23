import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

// Career pathways data - hardcoded directly in component
const CAREER_PATHWAYS_DATA = [
  {
    aspiringField: 'Engineering',
    careerPaths: ['Civil Engineer', 'Mechanical Engineer', 'Robotics Engineer']
  },
  {
    aspiringField: 'Tech',
    careerPaths: ['Software Developer', 'Cybersecurity Analyst', 'Cloud Architect']
  },
  {
    aspiringField: 'Medical & Health',
    careerPaths: ['Medical Doctor', 'Registered Nurse', 'Healthcare Administrator']
  },
  {
    aspiringField: 'Data Science',
    careerPaths: ['Machine Learning Engineer', 'Data Scientist', 'AI Research Scientist']
  },
  {
    aspiringField: 'Data Analytics',
    careerPaths: ['Business Intelligence Analyst', 'Operations Analyst', 'Market Research Analyst']
  },
  {
    aspiringField: 'Pure & Applied Science',
    careerPaths: ['Research Scientist', 'Biotechnologist', 'Environmental Consultant']
  },
  {
    aspiringField: 'Business & Management',
    careerPaths: ['Project Manager', 'Operations Manager', 'Management Consultant']
  },
  {
    aspiringField: 'Accounting',
    careerPaths: ['Certified Public Accountant', 'Forensic Accountant', 'Tax Auditor']
  },
  {
    aspiringField: 'Finance',
    careerPaths: ['Investment Banker', 'Financial Planner', 'Portfolio Manager']
  },
  {
    aspiringField: 'Humanities',
    careerPaths: ['Psychologist', 'Technical Writer', 'Policy Analyst']
  },
  {
    aspiringField: 'Design',
    careerPaths: ['UX/UI Designer', 'Graphic Designer', 'Industrial Designer']
  },
  {
    aspiringField: 'Media',
    careerPaths: ['Content Producer', 'Public Relations Specialist', 'Digital Editor']
  },
  {
    aspiringField: 'Networking',
    careerPaths: ['Network Engineer', 'Systems Administrator', 'Solutions Architect']
  },
  {
    aspiringField: 'Marketing',
    careerPaths: ['Digital Marketing Manager', 'Brand Strategist', 'Social Media Director']
  },
  {
    aspiringField: 'Law',
    careerPaths: ['Corporate Attorney', 'Legal Consultant', 'Paralegal']
  },
  {
    aspiringField: 'Computer Applications',
    careerPaths: ['Web Developer', 'Database Administrator', 'Mobile App Developer']
  },
  {
    aspiringField: 'Hospitality',
    careerPaths: ['Hotel Manager', 'Event Coordinator', 'Tourism Director']
  }
];

function RIASECCareerPathways({ careerPathways, dimensions }) {
  // Use hardcoded data directly - no API call needed
  const aspiringFieldsData = CAREER_PATHWAYS_DATA;

  const fieldRIASECMapping = useMemo(() => {
    return {
      'Engineering': { R: 0.4, I: 0.35, C: 0.15, A: 0.05, S: 0.03, E: 0.02 },
      'Tech': { I: 0.35, R: 0.25, C: 0.20, A: 0.10, E: 0.05, S: 0.05 },
      'Medical & Health': { I: 0.30, S: 0.35, C: 0.15, R: 0.10, E: 0.05, A: 0.05 },
      'Data Science': { I: 0.45, A: 0.20, C: 0.15, R: 0.10, E: 0.05, S: 0.05 },
      'Data Analytics': { I: 0.35, C: 0.30, E: 0.15, A: 0.10, S: 0.05, R: 0.05 },
      'Pure & Applied Science': { I: 0.50, R: 0.20, C: 0.15, A: 0.10, S: 0.03, E: 0.02 },
      'Business & Management': { E: 0.40, C: 0.25, S: 0.20, I: 0.10, A: 0.03, R: 0.02 },
      'Accounting': { C: 0.50, I: 0.20, E: 0.15, S: 0.10, R: 0.03, A: 0.02 },
      'Finance': { E: 0.35, C: 0.30, I: 0.20, S: 0.10, A: 0.03, R: 0.02 },
      'Humanities': { S: 0.35, A: 0.30, I: 0.20, E: 0.10, C: 0.03, R: 0.02 },
      'Design': { A: 0.45, I: 0.25, E: 0.15, S: 0.10, C: 0.03, R: 0.02 },
      'Media': { A: 0.35, E: 0.30, S: 0.20, I: 0.10, C: 0.03, R: 0.02 },
      'Networking': { I: 0.35, R: 0.30, C: 0.20, E: 0.10, A: 0.03, S: 0.02 },
      'Marketing': { E: 0.40, A: 0.25, S: 0.20, I: 0.10, C: 0.03, R: 0.02 },
      'Law': { E: 0.35, I: 0.25, C: 0.20, S: 0.15, A: 0.03, R: 0.02 },
      'Computer Applications': { I: 0.30, R: 0.25, C: 0.25, A: 0.10, E: 0.05, S: 0.05 },
      'Hospitality': { S: 0.40, E: 0.30, A: 0.15, C: 0.10, I: 0.03, R: 0.02 }
    };
  }, []);

  const calculatedPathways = useMemo(() => {
    if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) {
      console.warn('⚠️ No dimensions provided');
      return { rows: [], bestField: null, bestPath: null };
    }
    if (aspiringFieldsData.length === 0) {
      console.warn('⚠️ No aspiring fields data available');
      return { rows: [], bestField: null, bestPath: null };
    }

    const scoreMap = {};
    dimensions.forEach(d => {
      if (d.code) scoreMap[d.code] = d.score || 0;
    });

    const sortedDims = [...dimensions].sort((a, b) => {
      const scoreA = (a.score || 0);
      const scoreB = (b.score || 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (a.code || '').localeCompare(b.code || '');
    });
    const top3Codes = sortedDims.slice(0, 3).map(d => d.code).filter(c => c);
    const dominantCode = top3Codes[0] || 'I';
    const riasecMix = top3Codes.length === 3 ? `${top3Codes[0]}-${top3Codes[1]}-${top3Codes[2]}` : top3Codes.join('-');

    // Calculate compatibility score for each aspiring field
    // Formula: Compatibility = Σ (RIASEC_Weight × Student_Score) for all 6 dimensions
    // Example: If Engineering has R:0.4, I:0.35 and student scores R:80, I:75
    //          Compatibility = (0.4 × 80) + (0.35 × 75) + ... for all dimensions
    const calculateFieldCompatibility = (field) => {
      const weights = fieldRIASECMapping[field] || {};
      let compatibility = 0;
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
        const weight = weights[code] || 0;  // Field's RIASEC weight (0-1)
        const score = scoreMap[code] || 0;   // Student's RIASEC score (0-100)
        compatibility += weight * score;      // Weighted contribution
      });
      return compatibility;
    };

    const fieldScores = aspiringFieldsData.map(item => ({
      field: item.aspiringField,
      compatibility: calculateFieldCompatibility(item.aspiringField),
      paths: item.careerPaths || []
    })).sort((a, b) => {
      if (b.compatibility !== a.compatibility) return b.compatibility - a.compatibility;
      const aDominantWeight = fieldRIASECMapping[a.field]?.[dominantCode] || 0;
      const bDominantWeight = fieldRIASECMapping[b.field]?.[dominantCode] || 0;
      return bDominantWeight - aDominantWeight;
    });

    // Get top 3 fields for confidence calculation
    const top3Fields = fieldScores.slice(0, 3).map(f => f.field);
    const bestField = fieldScores[0]?.field || null;

    // Create one row per aspiring field with all 3 career paths
    const allRows = [];
    aspiringFieldsData.forEach(item => {
      const fieldCompatibility = calculateFieldCompatibility(item.aspiringField);
      
      // Get all 3 career paths for this field
      const allCareerPaths = item.careerPaths || [];
      
      // Find the best matching career path (first one has highest priority)
      const bestPathForField = allCareerPaths[0] || null;
      
      // Add one row per aspiring field with all career paths
      allRows.push({
        aspiringField: item.aspiringField,
        careerPaths: allCareerPaths, // All 3 career paths
        bestCareerPath: bestPathForField, // Best matching path for highlighting
        riasecMix: riasecMix,
        compatibility: fieldCompatibility
      });
    });
    
    // Sort rows by compatibility (best matches first)
    allRows.sort((a, b) => b.compatibility - a.compatibility);
    
    const bestPath = allRows[0]?.bestCareerPath || null;

    return {
      rows: allRows,
      bestField,
      bestPath,
      top3Fields
    };
  }, [dimensions, fieldRIASECMapping]);

  // Check if we have valid data
  if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <Rocket className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Potential Career Pathways
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="text-slate-600 dark:text-slate-400">RIASEC dimensions not available</div>
        </div>
      </motion.div>
    );
  }

  if (!calculatedPathways || !calculatedPathways.rows || calculatedPathways.rows.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <Rocket className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Potential Career Pathways
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="text-slate-600 dark:text-slate-400">Unable to calculate career pathways</div>
        </div>
      </motion.div>
    );
  }

  const { rows, bestField, bestPath, top3Fields = [] } = calculatedPathways;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center gap-2 mb-6">
        <Rocket className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Potential Career Pathways
      </h3>
      </div>
      
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {rows.map((row, index) => {
          const isBestField = row.aspiringField === bestField;
          const isBestPath = row.careerPaths && row.careerPaths.includes(bestPath);
          const isHighlighted = isBestField || isBestPath;
          
          const fieldRank = top3Fields.indexOf(row.aspiringField);
          
          const calculatePersona = (careerPath) => {
            const personaMap = {
              'Civil Engineer': 'The Infrastructure Builder',
              'Mechanical Engineer': 'The Mechanical Innovator',
              'Robotics Engineer': 'The Automation Specialist',
              'Software Developer': 'The Code Architect',
              'Cybersecurity Analyst': 'The Security Guardian',
              'Cloud Architect': 'The Cloud Strategist',
              'Medical Doctor': 'The Healthcare Provider',
              'Registered Nurse': 'The Care Specialist',
              'Healthcare Administrator': 'The Healthcare Manager',
              'Machine Learning Engineer': 'The AI Builder',
              'Data Scientist': 'The Insight Architect',
              'AI Research Scientist': 'The AI Researcher',
              'Business Intelligence Analyst': 'The Business Analyst',
              'Operations Analyst': 'The Operations Specialist',
              'Market Research Analyst': 'The Market Analyst',
              'Research Scientist': 'The Research Specialist',
              'Biotechnologist': 'The Biotechnology Expert',
              'Environmental Consultant': 'The Environmental Specialist',
              'Project Manager': 'The Project Leader',
              'Operations Manager': 'The Operations Leader',
              'Management Consultant': 'The Strategy Consultant',
              'Certified Public Accountant': 'The Financial Auditor',
              'Forensic Accountant': 'The Financial Investigator',
              'Tax Auditor': 'The Tax Specialist',
              'Investment Banker': 'The Financial Strategist',
              'Financial Planner': 'The Wealth Advisor',
              'Portfolio Manager': 'The Investment Manager',
              'Psychologist': 'The Mental Health Specialist',
              'Technical Writer': 'The Documentation Expert',
              'Policy Analyst': 'The Policy Specialist',
              'UX/UI Designer': 'The Creative Innovator',
              'Graphic Designer': 'The Visual Creator',
              'Industrial Designer': 'The Product Designer',
              'Content Producer': 'The Content Creator',
              'Public Relations Specialist': 'The PR Expert',
              'Digital Editor': 'The Digital Content Manager',
              'Network Engineer': 'The Network Architect',
              'Systems Administrator': 'The Systems Manager',
              'Solutions Architect': 'The Solution Designer',
              'Digital Marketing Manager': 'The Marketing Strategist',
              'Brand Strategist': 'The Brand Expert',
              'Social Media Director': 'The Social Media Leader',
              'Corporate Attorney': 'The Legal Advisor',
              'Legal Consultant': 'The Legal Expert',
              'Paralegal': 'The Legal Assistant',
              'Web Developer': 'The Web Builder',
              'Database Administrator': 'The Data Manager',
              'Mobile App Developer': 'The Mobile Innovator',
              'Hotel Manager': 'The Hospitality Leader',
              'Event Coordinator': 'The Event Specialist',
              'Tourism Director': 'The Tourism Manager'
            };
            return personaMap[careerPath] || 'The Professional';
          };

          const calculateFocus = (careerPath) => {
            const focusMap = {
              'Civil Engineer': 'Designing and constructing infrastructure projects through technical expertise and systematic planning.',
              'Mechanical Engineer': 'Developing mechanical systems and solutions through engineering principles and innovation.',
              'Robotics Engineer': 'Creating automated systems and robotic solutions through advanced engineering and programming.',
              'Software Developer': 'Building software applications through coding, problem-solving, and technical implementation.',
              'Cybersecurity Analyst': 'Protecting digital systems and data through security analysis and threat mitigation.',
              'Cloud Architect': 'Designing cloud infrastructure solutions for scalable and efficient systems.',
              'Medical Doctor': 'Providing medical care and treatment through clinical expertise and patient interaction.',
              'Registered Nurse': 'Delivering patient care and support through medical knowledge and compassion.',
              'Healthcare Administrator': 'Managing healthcare operations and services through organizational leadership.',
              'Machine Learning Engineer': 'Developing AI and machine learning systems through advanced algorithms and data science.',
              'Data Scientist': 'Analyzing complex data to extract insights and drive decision-making through statistical methods.',
              'AI Research Scientist': 'Advancing artificial intelligence through research, experimentation, and innovation.',
              'Business Intelligence Analyst': 'Transforming data into business insights through analysis and reporting.',
              'Operations Analyst': 'Optimizing business operations through data analysis and process improvement.',
              'Market Research Analyst': 'Understanding market trends and consumer behavior through research and analysis.',
              'Research Scientist': 'Conducting scientific research and experiments to advance knowledge and innovation.',
              'Biotechnologist': 'Applying biological processes to develop products and solutions through biotechnology.',
              'Environmental Consultant': 'Addressing environmental challenges through analysis, planning, and sustainable solutions.',
              'Project Manager': 'Leading projects to successful completion through planning, coordination, and team management.',
              'Operations Manager': 'Optimizing business operations through strategic planning and process management.',
              'Management Consultant': 'Improving organizational performance through strategic advice and analysis.',
              'Certified Public Accountant': 'Ensuring financial accuracy and compliance through accounting expertise and auditing.',
              'Forensic Accountant': 'Investigating financial discrepancies and fraud through detailed analysis and investigation.',
              'Tax Auditor': 'Reviewing tax compliance and accuracy through systematic examination and verification.',
              'Investment Banker': 'Facilitating financial transactions and investments through financial expertise and strategy.',
              'Financial Planner': 'Helping clients achieve financial goals through planning, analysis, and advice.',
              'Portfolio Manager': 'Managing investment portfolios through analysis, strategy, and risk management.',
              'Psychologist': 'Supporting mental health and well-being through psychological assessment and therapy.',
              'Technical Writer': 'Creating clear technical documentation through writing expertise and technical knowledge.',
              'Policy Analyst': 'Analyzing and developing policies through research, evaluation, and strategic thinking.',
              'UX/UI Designer': 'Designing user experiences and interfaces through creative vision and user research.',
              'Graphic Designer': 'Creating visual designs and communications through artistic skills and creativity.',
              'Industrial Designer': 'Designing products and systems through creative problem-solving and technical knowledge.',
              'Content Producer': 'Creating engaging content through creative storytelling and media production.',
              'Public Relations Specialist': 'Managing public image and communications through strategic messaging and media relations.',
              'Digital Editor': 'Curating and editing digital content through editorial expertise and content strategy.',
              'Network Engineer': 'Designing and maintaining network infrastructure through technical expertise and problem-solving.',
              'Systems Administrator': 'Managing IT systems and infrastructure through technical administration and maintenance.',
              'Solutions Architect': 'Designing technical solutions through system architecture and integration expertise.',
              'Digital Marketing Manager': 'Driving marketing success through digital strategies, campaigns, and analytics.',
              'Brand Strategist': 'Developing brand identity and positioning through strategic thinking and market analysis.',
              'Social Media Director': 'Leading social media strategy and engagement through content creation and community management.',
              'Corporate Attorney': 'Providing legal counsel and representation through legal expertise and strategic advice.',
              'Legal Consultant': 'Offering legal guidance and solutions through legal knowledge and analysis.',
              'Paralegal': 'Supporting legal operations through research, documentation, and administrative assistance.',
              'Web Developer': 'Building websites and web applications through coding and web technologies.',
              'Database Administrator': 'Managing databases and data systems through technical administration and optimization.',
              'Mobile App Developer': 'Creating mobile applications through programming and mobile platform expertise.',
              'Hotel Manager': 'Managing hotel operations and guest services through hospitality leadership and service excellence.',
              'Event Coordinator': 'Planning and executing events through organization, coordination, and attention to detail.',
              'Tourism Director': 'Developing tourism strategies and programs through destination management and marketing.'
            };
            return focusMap[careerPath] || 'Professional development and career growth through expertise and dedication.';
          };

          const calculateConfidence = () => {
            if (fieldRank === 0) {
              return { level: 'HIGH', label: 'High Confidence' };
            } else if (fieldRank === 1 || fieldRank === 2) {
              return { level: 'MODERATE', label: 'Moderate Confidence' };
            } else {
              return { level: 'LOW', label: 'Low Confidence' };
            }
          };

          const confidence = calculateConfidence();
          const confidenceColors = {
            HIGH: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
            MODERATE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
            LOW: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700'
          };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.02 }}
              className={`rounded-xl p-4 border transition-all duration-300 ${
                isHighlighted
                  ? 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-indigo-300 dark:border-indigo-700 shadow-lg'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className={`text-lg font-bold mb-2 ${isBestField ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                    {row.aspiringField}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {row.riasecMix ? row.riasecMix.split('-').map((code, idx) => {
                      const codeColors = {
                        'R': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
                        'I': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
                        'A': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
                        'S': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
                        'E': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
                        'C': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                      };
                      return (
                        <span
                          key={idx}
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold border flex-shrink-0 ${codeColors[code] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}`}
                        >
                          {code}
                        </span>
                      );
                    }) : (
                      <span className="text-sm text-slate-500 dark:text-slate-400">-</span>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ml-2 flex-shrink-0 ${confidenceColors[confidence.level] || confidenceColors.MODERATE}`}>
                  {confidence.label}
                </span>
              </div>

              {/* Career Paths */}
              {row.careerPaths && row.careerPaths.length > 0 && (
                <div className="space-y-3 mt-4">
                  {row.careerPaths.map((path, pathIdx) => (
                    <div key={pathIdx} className="border-t border-slate-200 dark:border-slate-700 pt-3 first:border-t-0 first:pt-0">
                      <div className={`font-semibold text-sm mb-1 ${isBestPath && path === bestPath ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                        {pathIdx + 1}. {path}
                      </div>
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {calculatePersona(path)}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {calculateFocus(path)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-900 dark:text-slate-100">
                Aspiring Field
              </th>
              <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-900 dark:text-slate-100">
                RIASEC Mix
              </th>
              <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-900 dark:text-slate-100">
                Career Path
              </th>
              <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-900 dark:text-slate-100">
                Professional Persona
              </th>
              <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-900 dark:text-slate-100">
                Core Tasks & Focus
              </th>
              <th className="text-left py-3 px-2 sm:px-4 font-semibold text-slate-900 dark:text-slate-100">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isBestField = row.aspiringField === bestField;
              const isBestPath = row.careerPaths && row.careerPaths.includes(bestPath);
              const isHighlighted = isBestField || isBestPath;
              
              // Get field rank for confidence calculation
              const fieldRank = top3Fields.indexOf(row.aspiringField);
              
              const calculatePersona = (careerPath) => {
                const personaMap = {
                  'Civil Engineer': 'The Infrastructure Builder',
                  'Mechanical Engineer': 'The Mechanical Innovator',
                  'Robotics Engineer': 'The Automation Specialist',
                  'Software Developer': 'The Code Architect',
                  'Cybersecurity Analyst': 'The Security Guardian',
                  'Cloud Architect': 'The Cloud Strategist',
                  'Medical Doctor': 'The Healthcare Provider',
                  'Registered Nurse': 'The Care Specialist',
                  'Healthcare Administrator': 'The Healthcare Manager',
                  'Machine Learning Engineer': 'The AI Builder',
                  'Data Scientist': 'The Insight Architect',
                  'AI Research Scientist': 'The AI Researcher',
                  'Business Intelligence Analyst': 'The Business Analyst',
                  'Operations Analyst': 'The Operations Specialist',
                  'Market Research Analyst': 'The Market Analyst',
                  'Research Scientist': 'The Research Specialist',
                  'Biotechnologist': 'The Biotechnology Expert',
                  'Environmental Consultant': 'The Environmental Specialist',
                  'Project Manager': 'The Project Leader',
                  'Operations Manager': 'The Operations Leader',
                  'Management Consultant': 'The Strategy Consultant',
                  'Certified Public Accountant': 'The Financial Auditor',
                  'Forensic Accountant': 'The Financial Investigator',
                  'Tax Auditor': 'The Tax Specialist',
                  'Investment Banker': 'The Financial Strategist',
                  'Financial Planner': 'The Wealth Advisor',
                  'Portfolio Manager': 'The Investment Manager',
                  'Psychologist': 'The Mental Health Specialist',
                  'Technical Writer': 'The Documentation Expert',
                  'Policy Analyst': 'The Policy Specialist',
                  'UX/UI Designer': 'The Creative Innovator',
                  'Graphic Designer': 'The Visual Creator',
                  'Industrial Designer': 'The Product Designer',
                  'Content Producer': 'The Content Creator',
                  'Public Relations Specialist': 'The PR Expert',
                  'Digital Editor': 'The Digital Content Manager',
                  'Network Engineer': 'The Network Architect',
                  'Systems Administrator': 'The Systems Manager',
                  'Solutions Architect': 'The Solution Designer',
                  'Digital Marketing Manager': 'The Marketing Strategist',
                  'Brand Strategist': 'The Brand Expert',
                  'Social Media Director': 'The Social Media Leader',
                  'Corporate Attorney': 'The Legal Advisor',
                  'Legal Consultant': 'The Legal Expert',
                  'Paralegal': 'The Legal Assistant',
                  'Web Developer': 'The Web Builder',
                  'Database Administrator': 'The Data Manager',
                  'Mobile App Developer': 'The Mobile Innovator',
                  'Hotel Manager': 'The Hospitality Leader',
                  'Event Coordinator': 'The Event Specialist',
                  'Tourism Director': 'The Tourism Manager'
                };
                return personaMap[careerPath] || 'The Professional';
              };

              const calculateFocus = (careerPath) => {
                const focusMap = {
                  'Civil Engineer': 'Designing and constructing infrastructure projects through technical expertise and systematic planning.',
                  'Mechanical Engineer': 'Developing mechanical systems and solutions through engineering principles and innovation.',
                  'Robotics Engineer': 'Creating automated systems and robotic solutions through advanced engineering and programming.',
                  'Software Developer': 'Building software applications through coding, problem-solving, and technical implementation.',
                  'Cybersecurity Analyst': 'Protecting digital systems and data through security analysis and threat mitigation.',
                  'Cloud Architect': 'Designing cloud infrastructure solutions for scalable and efficient systems.',
                  'Medical Doctor': 'Providing medical care and treatment through clinical expertise and patient interaction.',
                  'Registered Nurse': 'Delivering patient care and support through medical knowledge and compassion.',
                  'Healthcare Administrator': 'Managing healthcare operations and services through organizational leadership.',
                  'Machine Learning Engineer': 'Developing AI and machine learning systems through advanced algorithms and data science.',
                  'Data Scientist': 'Analyzing complex data to extract insights and drive decision-making through statistical methods.',
                  'AI Research Scientist': 'Advancing artificial intelligence through research, experimentation, and innovation.',
                  'Business Intelligence Analyst': 'Transforming data into business insights through analysis and reporting.',
                  'Operations Analyst': 'Optimizing business operations through data analysis and process improvement.',
                  'Market Research Analyst': 'Understanding market trends and consumer behavior through research and analysis.',
                  'Research Scientist': 'Conducting scientific research and experiments to advance knowledge and innovation.',
                  'Biotechnologist': 'Applying biological processes to develop products and solutions through biotechnology.',
                  'Environmental Consultant': 'Addressing environmental challenges through analysis, planning, and sustainable solutions.',
                  'Project Manager': 'Leading projects to successful completion through planning, coordination, and team management.',
                  'Operations Manager': 'Optimizing business operations through strategic planning and process management.',
                  'Management Consultant': 'Improving organizational performance through strategic advice and analysis.',
                  'Certified Public Accountant': 'Ensuring financial accuracy and compliance through accounting expertise and auditing.',
                  'Forensic Accountant': 'Investigating financial discrepancies and fraud through detailed analysis and investigation.',
                  'Tax Auditor': 'Reviewing tax compliance and accuracy through systematic examination and verification.',
                  'Investment Banker': 'Facilitating financial transactions and investments through financial expertise and strategy.',
                  'Financial Planner': 'Helping clients achieve financial goals through planning, analysis, and advice.',
                  'Portfolio Manager': 'Managing investment portfolios through analysis, strategy, and risk management.',
                  'Psychologist': 'Supporting mental health and well-being through psychological assessment and therapy.',
                  'Technical Writer': 'Creating clear technical documentation through writing expertise and technical knowledge.',
                  'Policy Analyst': 'Analyzing and developing policies through research, evaluation, and strategic thinking.',
                  'UX/UI Designer': 'Designing user experiences and interfaces through creative vision and user research.',
                  'Graphic Designer': 'Creating visual designs and communications through artistic skills and creativity.',
                  'Industrial Designer': 'Designing products and systems through creative problem-solving and technical knowledge.',
                  'Content Producer': 'Creating engaging content through creative storytelling and media production.',
                  'Public Relations Specialist': 'Managing public image and communications through strategic messaging and media relations.',
                  'Digital Editor': 'Curating and editing digital content through editorial expertise and content strategy.',
                  'Network Engineer': 'Designing and maintaining network infrastructure through technical expertise and problem-solving.',
                  'Systems Administrator': 'Managing IT systems and infrastructure through technical administration and maintenance.',
                  'Solutions Architect': 'Designing technical solutions through system architecture and integration expertise.',
                  'Digital Marketing Manager': 'Driving marketing success through digital strategies, campaigns, and analytics.',
                  'Brand Strategist': 'Developing brand identity and positioning through strategic thinking and market analysis.',
                  'Social Media Director': 'Leading social media strategy and engagement through content creation and community management.',
                  'Corporate Attorney': 'Providing legal counsel and representation through legal expertise and strategic advice.',
                  'Legal Consultant': 'Offering legal guidance and solutions through legal knowledge and analysis.',
                  'Paralegal': 'Supporting legal operations through research, documentation, and administrative assistance.',
                  'Web Developer': 'Building websites and web applications through coding and web technologies.',
                  'Database Administrator': 'Managing databases and data systems through technical administration and optimization.',
                  'Mobile App Developer': 'Creating mobile applications through programming and mobile platform expertise.',
                  'Hotel Manager': 'Managing hotel operations and guest services through hospitality leadership and service excellence.',
                  'Event Coordinator': 'Planning and executing events through organization, coordination, and attention to detail.',
                  'Tourism Director': 'Developing tourism strategies and programs through destination management and marketing.'
                };
                return focusMap[careerPath] || 'Professional development and career growth through expertise and dedication.';
              };

              const calculateConfidence = () => {
                // Top 3 confidence logic:
                // HIGH: Rank 1 (best field)
                // MODERATE: Rank 2-3
                // LOW: All others
                if (fieldRank === 0) {
                  return { level: 'HIGH', label: 'High Confidence' };
                } else if (fieldRank === 1 || fieldRank === 2) {
                  return { level: 'MODERATE', label: 'Moderate Confidence' };
                } else {
                  return { level: 'LOW', label: 'Low Confidence' };
                }
              };

              const confidence = calculateConfidence();
              const confidenceColors = {
                HIGH: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
                MODERATE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
                LOW: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700'
              };

              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.02 }}
                  className={`border-b border-slate-100 dark:border-slate-700 transition-all duration-300 ${
                    isHighlighted
                      ? 'relative'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  style={isHighlighted ? {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(59,130,246,0.28))',
                    border: '1px solid rgba(99,102,241,0.50)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.50)'
                  } : {}}
                >
                  <td className="py-4 px-2 sm:px-4 align-top">
                    <div className={`font-semibold text-slate-900 dark:text-slate-100 ${isBestField ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                      {row.aspiringField}
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 align-top">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {row.riasecMix ? row.riasecMix.split('-').map((code, idx) => {
                        const codeColors = {
                          'R': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
                          'I': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
                          'A': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
                          'S': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
                          'E': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
                          'C': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                        };
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold border flex-shrink-0 ${codeColors[code] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'}`}
                          >
                            {code}
                          </span>
                        );
                      }) : (
                        <span className="text-sm text-slate-500 dark:text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 align-top">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {row.careerPaths && row.careerPaths.length > 0 ? (
                        <ol className="list-decimal list-inside space-y-1">
                          {row.careerPaths.map((path, pathIdx) => (
                            <li 
                              key={pathIdx}
                              className={isBestPath && path === bestPath ? 'text-indigo-700 dark:text-indigo-300 font-semibold' : ''}
                            >
                              {path}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 align-top">
                    <div className="font-medium text-slate-900 dark:text-slate-100 space-y-1">
                      {row.careerPaths && row.careerPaths.length > 0 ? (
                        row.careerPaths.map((path, pathIdx) => (
                          <div key={pathIdx} className="text-sm">
                            {calculatePersona(path)}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 align-top">
                    <div className="text-slate-700 dark:text-slate-300 text-sm space-y-1">
                      {row.careerPaths && row.careerPaths.length > 0 ? (
                        row.careerPaths.map((path, pathIdx) => (
                          <div key={pathIdx} className="text-xs">
                            {calculateFocus(path)}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 sm:px-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${confidenceColors[confidence.level] || confidenceColors.MODERATE}`}>
                      {confidence.label}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Confidence Level Definitions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="font-semibold text-sm text-green-700 dark:text-green-300 mb-1">High Confidence</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Strong alignment between pathway requirements and your RIASEC profile. Primary and secondary traits match top scores with minimal gaps.</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="font-semibold text-sm text-yellow-700 dark:text-yellow-300 mb-1">Moderate Confidence</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Reasonable alignment with your profile. Some traits align well, though there may be moderate gaps between pathway needs and your scores.</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <div className="font-semibold text-sm text-orange-700 dark:text-orange-300 mb-1">Low Confidence</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Limited alignment between pathway requirements and your current RIASEC profile. Significant gaps suggest this may require additional development.</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RIASECCareerPathways;
