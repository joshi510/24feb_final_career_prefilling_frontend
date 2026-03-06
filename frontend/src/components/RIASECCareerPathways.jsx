import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

// RIASEC to Career Fields Mapping
const RIASEC_CAREER_FIELDS_MAPPING = {
  "R": ["Engineering", "Pure & Applied Science", "Computer Applications"],
  "I": ["Data Science", "Pure & Applied Science", "Data Analytics"],
  "A": ["Design", "Media", "Humanities"],
  "S": ["Hospitality", "Medical & Health", "Humanities"],
  "E": ["Marketing", "Business & Management", "Law"],
  "C": ["Accounting", "Finance", "Data Analytics"]
};

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
      'Pure & Applied Science': { I: 0.40, R: 0.35, C: 0.15, A: 0.05, S: 0.03, E: 0.02 },
      'Business & Management': { E: 0.40, C: 0.25, S: 0.20, I: 0.10, A: 0.03, R: 0.02 },
      'Accounting': { C: 0.50, I: 0.20, E: 0.15, S: 0.10, R: 0.03, A: 0.02 },
      'Finance': { E: 0.35, C: 0.30, I: 0.20, S: 0.10, A: 0.03, R: 0.02 },
      'Humanities': { S: 0.35, A: 0.30, I: 0.20, E: 0.10, C: 0.03, R: 0.02 },
      'Design': { A: 0.45, I: 0.25, E: 0.15, S: 0.10, C: 0.03, R: 0.02 },
      'Media': { A: 0.35, E: 0.30, S: 0.20, I: 0.10, C: 0.03, R: 0.02 },
      'Networking': { I: 0.35, R: 0.30, C: 0.20, E: 0.10, A: 0.03, S: 0.02 },
      'Marketing': { E: 0.40, A: 0.25, S: 0.20, I: 0.10, C: 0.03, R: 0.02 },
      'Law': { E: 0.35, I: 0.25, C: 0.20, S: 0.15, A: 0.03, R: 0.02 },
      'Computer Applications': { I: 0.30, R: 0.30, C: 0.20, A: 0.10, E: 0.05, S: 0.05 },
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

    // STEP 1: NORMALIZE STUDENT RIASEC SCORES (MANDATORY)
    const rawScoreMap = {};
    dimensions.forEach(d => {
      if (d.code) rawScoreMap[d.code] = d.score || 0;
    });

    const total = (rawScoreMap.R || 0) + (rawScoreMap.I || 0) + (rawScoreMap.A || 0) + 
                  (rawScoreMap.S || 0) + (rawScoreMap.E || 0) + (rawScoreMap.C || 0);
    
    // Prevent division by zero
    const safeTotal = total > 0 ? total : 1;
    
    const normalizedScores = {
      R: (rawScoreMap.R || 0) / safeTotal,
      I: (rawScoreMap.I || 0) / safeTotal,
      A: (rawScoreMap.A || 0) / safeTotal,
      S: (rawScoreMap.S || 0) / safeTotal,
      E: (rawScoreMap.E || 0) / safeTotal,
      C: (rawScoreMap.C || 0) / safeTotal
    };

    // Find dominant dimension
    const sortedDims = Object.entries(normalizedScores)
      .map(([code, score]) => ({ code, score }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.code.localeCompare(b.code);
      });
    
    const top3Codes = sortedDims.slice(0, 3).map(d => d.code);
    const dominantCode = top3Codes[0] || 'I';
    const riasecMix = top3Codes.length === 3 ? `${top3Codes[0]}-${top3Codes[1]}-${top3Codes[2]}` : top3Codes.join('-');

    // STEP 2: BASE COMPATIBILITY FORMULA (using normalized scores)
    const calculateBaseCompatibility = (field) => {
      const weights = fieldRIASECMapping[field] || {};
      let compatibility = 0;
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
        const weight = weights[code] || 0;
        const normalizedScore = normalizedScores[code] || 0;
        compatibility += weight * normalizedScore;
      });
      return compatibility;
    };

    // STEP 3: BEHAVIOURAL CONFLICT ENGINE
    const applyBehavioralConflicts = (field, baseCompatibility) => {
      let finalScore = baseCompatibility;
      const Rn = normalizedScores.R;
      const In = normalizedScores.I;
      const An = normalizedScores.A;
      const Sn = normalizedScores.S;
      const En = normalizedScores.E;
      const Cn = normalizedScores.C;

      // Field-specific conflict rules
      switch (field) {
        case 'Engineering':
          // Priority boost: R dominant
          if (dominantCode === "R") {
            finalScore = finalScore + 1;
          }
          // Conflict: A dominant with low R
          if (An > Rn && Rn < 0.15) {
            finalScore *= 0.75;
          }
          break;

        case 'Tech':
          // Conflict: C dominant with low R/I
          if (Cn > Math.max(Rn, In) && (Rn + In) < 0.30) {
            finalScore *= 0.70;
          }
          break;

        case 'Medical & Health':
          // Conflict: S low or R dominant
          if (Sn < 0.15) {
            finalScore *= 0.65;
          } else if (Rn > Math.max(In, Sn)) {
            finalScore *= 0.75;
          }
          break;

        case 'Data Science':
          // Conflict: R dominant over I
          if (Rn > In) {
            finalScore *= 0.80;
          }
          // Boost: I dominant
          if (In > Math.max(Rn, An, Sn, En, Cn)) {
            finalScore *= 1.10;
          }
          break;

        case 'Data Analytics':
          // Conflict: A dominant
          if (An > Math.max(In, Cn)) {
            finalScore *= 0.75;
          }
          break;

        case 'Pure & Applied Science':
          // Conflict: E dominant
          if (En > Math.max(In, Rn)) {
            finalScore *= 0.75;
          }
          break;

        case 'Business & Management':
          // Conflict: R dominant
          if (Rn > Math.max(En, Cn)) {
            finalScore *= 0.75;
          }
          break;

        case 'Accounting':
          // Critical conflicts
          if (Rn >= Cn) {
            finalScore *= 0.60;
          } else if (In > Cn * 1.2) {
            finalScore *= 0.75;
          } else if (An > 0.20) {
            finalScore *= 0.75;
          }
          break;

        case 'Finance':
          // Conflict: A dominant
          if (An > Math.max(En, Cn)) {
            finalScore *= 0.75;
          }
          // Boost: E dominant
          if (En > Math.max(Cn, In)) {
            finalScore *= 1.05;
          }
          break;

        case 'Humanities':
          // Conflict: C dominant
          if (Cn > Math.max(An, Sn)) {
            finalScore *= 0.70;
          }
          break;

        case 'Design':
          // Critical conflict: C >= A
          if (Cn >= An) {
            finalScore *= 0.60;
          }
          break;

        case 'Media':
          // Conflict: R dominant
          if (Rn > Math.max(An, En)) {
            finalScore *= 0.75;
          }
          break;

        case 'Networking':
          // Conflict: A dominant
          if (An > Math.max(Rn, In)) {
            finalScore *= 0.75;
          }
          break;

        case 'Marketing':
          // Conflict: C dominant
          if (Cn > Math.max(En, An)) {
            finalScore *= 0.70;
          }
          break;

        case 'Law':
          // Conflict: A dominant
          if (An > Math.max(En, Cn, In)) {
            finalScore *= 0.70;
          }
          break;

        case 'Computer Applications':
          // Boost: I dominant
          if (In > Math.max(Rn, Cn, An, Sn, En)) {
            finalScore *= 1.15;
          }
          // Conflict: C dominant with low I/R
          if (Cn > Math.max(In, Rn) && (Rn + In) < 0.40) {
            finalScore *= 0.70;
          }
          break;

        case 'Hospitality':
          // Conflict: I dominant with low S
          if (In > Math.max(Sn, En) && Sn < 0.20) {
            finalScore *= 0.75;
          }
          break;
      }

      return finalScore;
    };

    // Calculate base compatibility and apply conflicts
    const fieldScores = aspiringFieldsData.map(item => {
      const baseCompatibility = calculateBaseCompatibility(item.aspiringField);
      const finalScore = applyBehavioralConflicts(item.aspiringField, baseCompatibility);
      
      return {
        field: item.aspiringField,
        baseCompatibility,
        finalScore,
        paths: item.careerPaths || []
      };
    });

    // Sort by final score
    fieldScores.sort((a, b) => {
      if (Math.abs(b.finalScore - a.finalScore) > 0.0001) {
        return b.finalScore - a.finalScore;
      }
      // Tie-breaker: dominant dimension weight
      const aDominantWeight = fieldRIASECMapping[a.field]?.[dominantCode] || 0;
      const bDominantWeight = fieldRIASECMapping[b.field]?.[dominantCode] || 0;
      return bDominantWeight - aDominantWeight;
    });

    // STEP 5: STABILITY MARGIN
    const bestScore = fieldScores[0]?.finalScore || 0;
    const secondBestScore = fieldScores[1]?.finalScore || 0;
    const scoreDifference = bestScore - secondBestScore;
    const stabilityThreshold = 0.12; // 12% threshold

    // If unstable competition, prefer fields in same cluster
    let finalRanking = [...fieldScores];
    if (scoreDifference < stabilityThreshold && fieldScores.length > 1) {
      // Get dominant cluster
      const dominantCluster = dominantCode;
      const clusterFields = {
        'I': ['Data Science', 'Pure & Applied Science', 'Tech', 'Computer Applications', 'Data Analytics'],
        'R': ['Engineering', 'Pure & Applied Science', 'Tech', 'Networking', 'Computer Applications'],
        'A': ['Design', 'Media', 'Humanities'],
        'E': ['Business & Management', 'Finance', 'Marketing', 'Law'],
        'C': ['Accounting', 'Finance', 'Business & Management', 'Data Analytics'],
        'S': ['Medical & Health', 'Humanities', 'Hospitality']
      };

      const preferredFields = clusterFields[dominantCluster] || [];
      
      // Boost fields in same cluster when competition is tight
      finalRanking = fieldScores.map(item => {
        if (preferredFields.includes(item.field) && scoreDifference < stabilityThreshold) {
          return {
            ...item,
            finalScore: item.finalScore * 1.05 // Small boost for cluster alignment
          };
        }
        return item;
      }).sort((a, b) => {
        if (Math.abs(b.finalScore - a.finalScore) > 0.0001) {
          return b.finalScore - a.finalScore;
        }
        const aDominantWeight = fieldRIASECMapping[a.field]?.[dominantCode] || 0;
        const bDominantWeight = fieldRIASECMapping[b.field]?.[dominantCode] || 0;
        return bDominantWeight - aDominantWeight;
      });
    }

    // STEP 6: ENFORCE TOP 2 POSITIONS BASED ON DOMINANT DIMENSION
    const dominantTop2Fields = {
      'R': {
        first: ['Engineering', 'Pure & Applied Science'],
        second: ['Computer Applications']
      },
      'I': {
        first: ['Pure & Applied Science'],
        second: ['Data Science']
      },
      'A': {
        first: ['Design'],
        second: ['Media']
      },
      'S': {
        first: ['Hospitality'],
        second: ['Medical & Health']
      },
      'E': {
        first: ['Business & Management'],
        second: ['Marketing', 'Finance']
      },
      'C': {
        first: ['Accounting'],
        second: ['Finance', 'Data Analytics']
      }
    };

    const top2Rules = dominantTop2Fields[dominantCode] || { first: [], second: [] };
    
    // Find current positions of required fields
    const fieldIndexMap = {};
    finalRanking.forEach((item, index) => {
      fieldIndexMap[item.field] = index;
    });

    // Get the highest score from finalRanking for reference
    const maxScore = finalRanking[0]?.finalScore || 1;
    
    // Adjust scores to enforce top 2 positions
    const adjustedRanking = finalRanking.map(item => {
      // First position fields - set to max score (tied)
      if (top2Rules.first.includes(item.field)) {
        return { ...item, finalScore: maxScore };
      }
      // Second position fields - set to maxScore * 0.95 (slightly below first)
      if (top2Rules.second.includes(item.field)) {
        // If multiple second options, use the one with higher original score
        const secondFields = top2Rules.second.filter(f => fieldIndexMap[f] !== undefined);
        const secondScores = secondFields.map(f => {
          const idx = fieldIndexMap[f];
          return { field: f, score: finalRanking[idx]?.finalScore || 0 };
        });
        secondScores.sort((a, b) => b.score - a.score);
        const bestSecond = secondScores[0]?.field;
        if (item.field === bestSecond) {
          return { ...item, finalScore: maxScore * 0.95 };
        }
      }
      return item;
    });

    // Re-sort with adjusted scores
    adjustedRanking.sort((a, b) => {
      if (Math.abs(b.finalScore - a.finalScore) > 0.0001) {
        return b.finalScore - a.finalScore;
      }
      const aDominantWeight = fieldRIASECMapping[a.field]?.[dominantCode] || 0;
      const bDominantWeight = fieldRIASECMapping[b.field]?.[dominantCode] || 0;
      return bDominantWeight - aDominantWeight;
    });

    // Get student's RIASEC scores
    const studentScores = {};
    dimensions.forEach(d => {
      if (d.code) studentScores[d.code] = d.score || 0;
    });

    // Sort RIASEC dimensions by score (highest first)
    const sortedDimensions = ['R', 'I', 'A', 'S', 'E', 'C']
      .map(code => ({
        code,
        score: studentScores[code] || 0
      }))
      .sort((a, b) => {
        // Sort by score descending, then by code if scores are equal
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.code.localeCompare(b.code);
      });

    // Restructure: Create 6 rows (one per RIASEC dimension) with exact 3 fields from mapping, ordered by score
    const riasecRows = sortedDimensions.map(({ code }) => {
      // Get the exact 3 fields for this RIASEC dimension from the mapping
      const mappedFields = RIASEC_CAREER_FIELDS_MAPPING[code] || [];
      
      // Get field data for the mapped fields
      const fieldsForDimension = mappedFields.map(fieldName => {
        const fieldData = aspiringFieldsData.find(item => item.aspiringField === fieldName);
        if (!fieldData) {
          return null;
        }
        
        const weights = fieldRIASECMapping[fieldData.aspiringField] || {};
        const weight = weights[code] || 0;
        const baseCompatibility = calculateBaseCompatibility(fieldData.aspiringField);
        const finalScore = applyBehavioralConflicts(fieldData.aspiringField, baseCompatibility);

    return {
          field: fieldData.aspiringField,
          weight: weight,
          finalScore: finalScore,
          paths: fieldData.careerPaths || []
        };
      }).filter(f => f !== null); // Remove any fields not found in data
      
      // Keep the exact order from RIASEC_CAREER_FIELDS_MAPPING for display (1, 2, 3).
      const sortedFields = fieldsForDimension;
      
      return {
        riasecCode: code,
        riasecScore: Math.round(studentScores[code] || 0),
        fields: sortedFields.map(f => ({
          aspiringField: f.field,
          careerPaths: f.paths,
          weight: f.weight
        }))
      };
    });

    return {
      rows: riasecRows,
      bestField: null,
      bestPath: null
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

  const { rows } = calculatedPathways;

  const riasecLabels = {
    'R': 'Realistic',
    'I': 'Investigative',
    'A': 'Artistic',
    'S': 'Social',
    'E': 'Enterprising',
    'C': 'Conventional'
  };

  const riasecColors = {
    'R': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    'I': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    'A': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    'S': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    'E': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
    'C': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
          <Target className="w-6 h-6 text-white flex-shrink-0" />
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
        Potential Career Pathways
      </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Discover your top career matches based on your RIASEC profile
          </p>
        </div>
      </div>

      {/* Mapping Information Message */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
          <span className="font-semibold">Note:</span> Career fields are mapped to RIASEC personality clusters based on Holland's vocational theory. Some fields may appear in multiple clusters due to overlapping skill and personality requirements.
        </p>
      </div>
      
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-5">
        {rows.map((row, index) => {
          const score = row.riasecScore || 0;
          const matchLevel = score >= 30 ? 'HIGH' : score >= 15 ? 'MODERATE' : 'LOW';
          const matchLabels = {
            'HIGH': 'High Match',
            'MODERATE': 'Moderate Match',
            'LOW': 'Low Match'
          };
          const matchColors = {
            'HIGH': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-green-200 dark:shadow-green-900/50',
            'MODERATE': 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-yellow-400 shadow-yellow-200 dark:shadow-yellow-900/50',
            'LOW': 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400 shadow-orange-200 dark:shadow-orange-900/50'
          };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.02 }}
              className="group relative rounded-2xl p-5 border-2 bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600 overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                {/* RIASEC Dimension Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold border-2 shadow-md flex-shrink-0 ${riasecColors[row.riasecCode] || ''}`}>
                    {row.riasecCode}
                    </span>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {riasecLabels[row.riasecCode]}
                    </h4>
                  </div>
                  </div>
                
                {/* Match Badge and Score */}
                <div className="flex items-center gap-3 mb-5">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border-2 shadow-md ${matchColors[matchLevel] || matchColors.MODERATE}`}>
                    {matchLabels[matchLevel]}
                </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Score:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{score}%</span>
                  </div>
              </div>

                {/* 3 Fields */}
                <div className="space-y-4">
                  {row.fields.map((field, fieldIdx) => (
                    <div 
                      key={fieldIdx} 
                      className="relative p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-800/50 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-indigo-200/50 dark:ring-indigo-800/50">
                          {fieldIdx + 1}
                      </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base text-slate-900 dark:text-slate-100 mb-3">
                            {field.aspiringField}
                      </div>
                          {field.careerPaths && field.careerPaths.length > 0 && (
                            <div className="space-y-2">
                              {field.careerPaths.map((path, pathIdx) => (
                                <div 
                                  key={pathIdx}
                                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                  <span>{path}</span>
                    </div>
                  ))}
                </div>
              )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-base">
                RIASEC Dimension
              </th>
              <th colSpan={3} className="text-center py-3 px-4 font-bold text-slate-700 dark:text-slate-300 text-base">
                Career Path
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const score = row.riasecScore || 0;
              const matchLevel = score >= 30 ? 'HIGH' : score >= 15 ? 'MODERATE' : 'LOW';
              const matchLabels = {
                'HIGH': 'High Match',
                'MODERATE': 'Moderate Match',
                'LOW': 'Low Match'
              };
              const matchColors = {
                'HIGH': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700',
                'MODERATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
                'LOW': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-700'
              };

              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.02 }}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold border ${riasecColors[row.riasecCode] || ''}`}>
                        {row.riasecCode}
                      </span>
                      <span className="font-semibold text-base text-slate-900 dark:text-slate-100">
                        {riasecLabels[row.riasecCode]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${matchColors[matchLevel] || matchColors.MODERATE}`}>
                        {matchLabels[matchLevel]}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {score}%
                      </span>
                    </div>
                  </td>
                  {row.fields.map((field, fieldIdx) => (
                    <td key={fieldIdx} className="py-4 px-4 align-top">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                          {fieldIdx + 1}
                        </span>
                        <div className="font-medium text-base text-slate-900 dark:text-slate-100">
                          {field.aspiringField}
                        </div>
                      </div>
                      {field.careerPaths && field.careerPaths.length > 0 && (
                        <div className="space-y-1 pl-8">
                          {field.careerPaths.map((path, pathIdx) => (
                            <div 
                              key={pathIdx}
                              className="text-sm text-slate-600 dark:text-slate-400"
                            >
                              • {path}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default RIASECCareerPathways;