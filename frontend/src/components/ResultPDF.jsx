import React, { useMemo } from 'react';

// RIASEC to Career Fields Mapping
const RIASEC_CAREER_FIELDS_MAPPING = {
  "R": ["Engineering", "Pure & Applied Science", "Computer Applications"],
  "I": ["Data Science", "Pure & Applied Science", "Data Analytics"],
  "A": ["Design", "Media", "Humanities"],
  "S": ["Hospitality", "Medical & Health", "Humanities"],
  "E": ["Marketing", "Business & Management", "Law"],
  "C": ["Accounting", "Finance", "Data Analytics"]
};


// Career pathways data - same as frontend component
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

function ResultPDF({ interpretation, counsellorNote, user, riasecReport }) {
  const calculateMatchLevel = (score) => {
    if (score >= 30) return 'HIGH MATCH';
    if (score >= 15) return 'MODERATE MATCH';
    return 'LOW MATCH';
  };

  const getMatchLevelColor = (matchLevel) => {
    if (matchLevel === 'HIGH MATCH') {
      return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
    } else if (matchLevel === 'MODERATE MATCH') {
      return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    } else {
      return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
    }
  };

  const getDimensionColor = (code) => {
    const colors = {
      R: { bg: '#fff7ed', border: '#fb923c', text: '#9a3412' },
      I: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a8a' },
      A: { bg: '#faf5ff', border: '#a855f7', text: '#6b21a8' },
      S: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
      E: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
      C: { bg: '#f8fafc', border: '#64748b', text: '#334155' }
    };
    return colors[code] || colors.C;
  };

  const getRiskColor = (level) => {
    if (level === 'Low Risk') {
      return { bg: '#f0fdf4', border: '#22c55e', text: '#166534' };
    } else if (level === 'Moderate Risk') {
      return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' };
    } else {
      return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
    }
  };

  const getConfidenceColor = (level) => {
    if (level === 'HIGH') {
      return { bg: '#dcfce7', text: '#166534', border: '#22c55e' };
    } else if (level === 'MODERATE') {
      return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    } else {
      return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
    }
  };

  const formatBulletPoints = (text) => {
    if (!text) return [];
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => line.trim().replace(/^[•\-\*]\s*/, ''));
  };

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: '40px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontSize: '13px',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      color: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: '20px',
      letterSpacing: '-0.5px'
    },
    headerInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginTop: '15px'
    },
    headerItem: {
      fontSize: '13px',
      color: '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    section: {
      marginBottom: '30px',
      pageBreakInside: 'avoid'
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #e2e8f0'
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    infoBox: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '15px',
      fontSize: '11px',
      color: '#64748b'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      fontSize: '12px'
    },
    tableHeader: {
      backgroundColor: '#1e293b',
      color: '#ffffff',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '12px',
      border: '1px solid #334155'
    },
    tableCell: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      color: '#334155',
      backgroundColor: '#ffffff'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      wordBreak: 'break-word',
      whiteSpace: 'normal'
    },
    bulletList: {
      listStyle: 'none',
      paddingLeft: '0',
      marginTop: '10px'
    },
    bulletItem: {
      marginBottom: '8px',
      paddingLeft: '20px',
      position: 'relative',
      color: '#334155',
      lineHeight: '1.6'
    },
    bulletMarker: {
      position: 'absolute',
      left: '0',
      color: '#64748b'
    },
    divider: {
      height: '1px',
      backgroundColor: '#e2e8f0',
      margin: '25px 0'
    },
    scoreDisplay: {
      fontSize: '56px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
      lineHeight: '1.2'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '8px'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    }
  };

  return (
    <div id="result-pdf" style={styles.container}>
      {/* Logo - Before Header */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', paddingTop: '10px' }}>
        <img 
          src="/images/tops-logo.png" 
          alt="Company Logo" 
          style={{
            maxWidth: '250px',
            maxHeight: '100px',
            objectFit: 'contain'
          }}
          onError={(e) => {
            // Hide logo if it fails to load
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Professional Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Career Assessment Report</h1>
        <div style={styles.headerInfo}>
          {user?.full_name && (
            <div style={styles.headerItem}>
              <span style={{ fontWeight: '600' }}>Student Name:</span> {user.full_name}
            </div>
          )}
          <div style={styles.headerItem}>
            <span style={{ fontWeight: '600' }}>Report Date:</span> {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          {user?.email && (
            <div style={styles.headerItem}>
              <span style={{ fontWeight: '600' }}>Email Address:</span> {user.email}
            </div>
          )}
        </div>
      </div>

      {/* RIASEC Profile Section */}
      {riasecReport && riasecReport.riasecProfile && (
      <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your RIASEC Profile</h2>
        
        {/* Decision Risk */}
        {riasecReport.riasecProfile.decisionRisk && (
          <div style={{
            ...styles.card,
              backgroundColor: getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').bg,
              borderLeft: `4px solid ${getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').border}`
            }}>
              <h3 style={styles.cardTitle}>Decision Risk Assessment</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
              <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#64748b' }}>Risk Level</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').text }}>
                  {riasecReport.riasecProfile.decisionRisk.level}
                </p>
              </div>
              <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#64748b' }}>Stability</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').text }}>
                  {riasecReport.riasecProfile.decisionRisk.stability}
                </p>
              </div>
            </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                Note: Decision risk assessment is based on score distribution patterns and should be interpreted as a guidance tool, not a definitive prediction.
              </p>
          </div>
        )}

        {/* Top Qualities */}
        {riasecReport.riasecProfile.topQualities && riasecReport.riasecProfile.topQualities.length > 0 && (
          <div style={{
            ...styles.card,
              backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b'
          }}>
              <h3 style={styles.cardTitle}>Top Qualities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {riasecReport.riasecProfile.topQualities.map((quality, idx) => (
                <div key={idx} style={{
                    padding: '10px',
                  backgroundColor: '#ffffff',
                    borderRadius: '6px',
                  border: '1px solid #fde68a',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#92400e'
                  }}>
                    {quality}
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Top Traits */}
        {riasecReport.riasecProfile.topTraits && riasecReport.riasecProfile.topTraits.length > 0 && (
          <div style={{
            ...styles.card,
              backgroundColor: '#faf5ff',
            borderLeft: '4px solid #8b5cf6'
          }}>
              <h3 style={styles.cardTitle}>Top Traits</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Rank</th>
                  <th style={styles.tableHeader}>Trait</th>
                  <th style={styles.tableHeader}>Label</th>
                  <th style={styles.tableHeader}>Score</th>
                </tr>
              </thead>
              <tbody>
                {riasecReport.riasecProfile.topTraits.map((trait, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ ...styles.tableCell, textAlign: 'center', fontWeight: 'bold', color: '#8b5cf6' }}>
                      #{idx + 1}
                    </td>
                      <td style={{ ...styles.tableCell, fontWeight: 'bold' }}>{trait.code}</td>
                    <td style={styles.tableCell}>{trait.label}</td>
                      <td style={{ ...styles.tableCell, fontWeight: 'bold', color: '#8b5cf6' }}>
                      {trait.score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      )}

      {/* RIASEC Dimensions Overview */}
      {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>RIASEC Dimensions Overview</h2>
          
          {(() => {
            const getDimensionConfig = (code) => {
              const configs = {
                R: { name: 'Realistic', description: 'Hands-on and practical', color: '#EF4444' },
                I: { name: 'Investigative', description: 'Observant and reflective', color: '#3B82F6' },
                A: { name: 'Artistic', description: 'Creative and original', color: '#A855F7' },
                S: { name: 'Social', description: 'Work with people', color: '#22C55E' },
                E: { name: 'Enterprising', description: 'Decisive and influential', color: '#F59E0B' },
                C: { name: 'Conventional', description: 'Structure and order', color: '#64748B' }
              };
              return configs[code] || { name: code, description: '', color: '#64748B' };
            };

            const calculateMatchLevel = (score) => {
              if (score >= 30) return 'HIGH';
              if (score >= 15) return 'MODERATE';
              return 'LOW';
            };

            const sortedDimensions = [...riasecReport.dimensions].sort((a, b) => (b.score || 0) - (a.score || 0));
            const top3Codes = sortedDimensions.slice(0, 3).map(d => d.code);
            
            // Order: R, I, A, S, E, C (standard RIASEC order)
            const orderedDimensions = ['R', 'I', 'A', 'S', 'E', 'C']
              .map(code => riasecReport.dimensions.find(d => d.code === code))
              .filter(Boolean);

            return (
              <div style={styles.card}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '12px',
                  marginBottom: '15px'
                }}>
                  {orderedDimensions.map((dimension) => {
                    const config = getDimensionConfig(dimension.code);
                    const score = Math.round(dimension.score || 0);
                    const matchLevel = calculateMatchLevel(score);
                    const isTop3 = top3Codes.includes(dimension.code);
                    const matchColors = getMatchLevelColor(matchLevel);
                    
                    return (
                      <div
                        key={dimension.code}
                        style={{
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          border: `2px solid ${config.color}40`,
                          borderRadius: '8px',
                          borderLeft: `4px solid ${config.color}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: config.color,
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {dimension.code}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>
                              {config.name}
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>
                              {config.description}
                            </div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 'bold', color: config.color }}>
                            {score}%
                          </span>
                          {isTop3 && (
                            <span style={{
                              fontSize: '9px',
                              fontWeight: '600',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#ffffff',
                              color: '#64748b',
                              border: '1px solid #e2e8f0'
                            }}>
                              Top 3
                            </span>
                          )}
                        </div>
                        
                        <div style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginBottom: '4px'
                        }}>
                          <div
                            style={{
                              width: `${score}%`,
                              height: '100%',
                              backgroundColor: config.color,
                              borderRadius: '3px'
                            }}
                          />
                        </div>
                        
                        <div style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: matchColors.text,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: matchColors.bg,
                          border: `1px solid ${matchColors.border}`,
                          display: 'inline-block'
                        }}>
                          {matchLevel} MATCH
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Summary */}
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.5' }}>
                    <strong>Dominant Types:</strong> {sortedDimensions.slice(0, 2).map(d => d.title || d.code || getDimensionConfig(d.code).name).join(' + ')}
                    {sortedDimensions[2] && (
                      <span>. <strong>Secondary Influence:</strong> {sortedDimensions[2].title || sortedDimensions[2].code || getDimensionConfig(sortedDimensions[2].code).name}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Detailed Dimension Analysis */}
      {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Detailed Dimension Analysis</h2>
          {riasecReport.dimensions.map((dimension, index) => {
            const colors = getDimensionColor(dimension.code);
            const score = Math.round(dimension.score || 0);
            const matchLevel = dimension.matchLevel || calculateMatchLevel(score);
            const matchColors = getMatchLevelColor(matchLevel);
            
            return (
              <div key={dimension.code} style={{
                ...styles.card,
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: colors.text }}>
                      {dimension.title}
                    </h3>
                    {dimension.calculationInsight && (
                      <p style={{ margin: '5px 0', fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                        Calculation Insight: {dimension.calculationInsight}
                      </p>
                    )}
                  </div>
                  <div style={{
                    ...styles.badge,
                    backgroundColor: matchColors.bg,
                    color: matchColors.text,
                    border: `1px solid ${matchColors.border}`,
                    maxWidth: '120px',
                    textAlign: 'center',
                    justifyContent: 'center'
                  }}>
                    {matchLevel}
                  </div>
                </div>
                
                <div style={styles.infoBox}>
                  Rationale: Thresholds are intentionally calibrated for relative preference detection rather than psychometric percentile ranking. Scores reflect directional tendencies, not clinical intensity.
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#334155' }}>
                      {dimension.tagline || `${dimension.title} tasks.`}
                    </p>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: colors.text }}>
                      {score}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${score}%`,
                      backgroundColor: colors.border
                    }}></div>
                  </div>
                </div>

                {dimension.personalizedAnalysis && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      Personalized Analysis
                    </h4>
                    {dimension.personalizedAnalysis.includes('•') ? (
                      <ul style={styles.bulletList}>
                        {formatBulletPoints(dimension.personalizedAnalysis).map((point, idx) => (
                          <li key={idx} style={styles.bulletItem}>
                            <span style={styles.bulletMarker}>•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                        {dimension.personalizedAnalysis}
                      </p>
                    )}
                  </div>
                )}

                {dimension.coreStrengths && dimension.coreStrengths.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      Strengths
                    </h4>
                    <ul style={styles.bulletList}>
                      {dimension.coreStrengths.map((strength, idx) => (
                        <li key={idx} style={styles.bulletItem}>
                          <span style={styles.bulletMarker}>•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dimension.growthAreas && dimension.growthAreas.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      Growth Areas
                    </h4>
                    <ul style={styles.bulletList}>
                      {dimension.growthAreas.map((area, idx) => (
                        <li key={idx} style={styles.bulletItem}>
                          <span style={styles.bulletMarker}>•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dimension.workStylePreferences && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      Work Style Preferences
                    </h4>
                    {dimension.workStylePreferences.includes('•') ? (
                      <ul style={styles.bulletList}>
                        {formatBulletPoints(dimension.workStylePreferences).map((point, idx) => (
                          <li key={idx} style={styles.bulletItem}>
                            <span style={styles.bulletMarker}>•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                        {dimension.workStylePreferences}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={styles.divider}></div>

      {/* Counsellor Summary - At the very top */}
      {interpretation?.counsellor_summary && String(interpretation.counsellor_summary).trim() && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Counsellor Summary</h2>
          <div style={{
            ...styles.card,
            backgroundColor: '#f3e8ff',
            borderLeft: '4px solid #9333ea'
          }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {String(interpretation.counsellor_summary).trim()}
            </p>
          </div>
        </div>
      )}

      {/* Score Summary */}
      {interpretation && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Score Summary</h2>
          <div style={{
            ...styles.card,
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '30px'
          }}>
            {/* Overall Score */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={styles.scoreDisplay}>
                {Math.round(interpretation.overall_percentage || 0)}%
              </div>
              <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '600', color: '#334155' }}>Overall Performance</p>
            </div>

            {/* Strengths and Improvement Areas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              {/* Key Strengths */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
                  Key Strengths
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '10px' }}>
                  You have a good base in some skills.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(() => {
                    let strengthsArray = [];
                    if (interpretation.strengths) {
                      if (Array.isArray(interpretation.strengths)) {
                        strengthsArray = interpretation.strengths;
                      } else if (typeof interpretation.strengths === 'string') {
                        try {
                          const parsed = JSON.parse(interpretation.strengths);
                          strengthsArray = Array.isArray(parsed) ? parsed : [];
                        } catch {
                          strengthsArray = interpretation.strengths.split('\n').filter(s => s.trim());
                        }
                      }
                    }
                    return strengthsArray.length > 0 ? (
                      strengthsArray.slice(0, 3).map((strength, idx) => (
                        <li key={idx} style={{ fontSize: '12px', color: '#334155', marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, color: '#22c55e' }}>•</span>
                          {strength}
                        </li>
                      ))
                    ) : (
                      <li style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No specific strengths identified yet</li>
                    );
                  })()}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                  Areas to Improve
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '10px' }}>
                  Some skills need more practice. This is normal.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(() => {
                    let weaknessesArray = [];
                    if (interpretation.weaknesses || interpretation.areas_for_improvement) {
                      const source = interpretation.weaknesses || interpretation.areas_for_improvement;
                      if (Array.isArray(source)) {
                        weaknessesArray = source;
                      } else if (typeof source === 'string') {
                        try {
                          const parsed = JSON.parse(source);
                          weaknessesArray = Array.isArray(parsed) ? parsed : [];
                        } catch {
                          weaknessesArray = source.split('\n').filter(s => s.trim());
                        }
                      }
                    }
                    return weaknessesArray.length > 0 ? (
                      weaknessesArray.slice(0, 3).map((weakness, idx) => (
                        <li key={idx} style={{ fontSize: '12px', color: '#334155', marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, color: '#f59e0b' }}>•</span>
                          {weakness}
                        </li>
                      ))
                    ) : (
                      <li style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No specific improvement areas identified yet</li>
                    );
                  })()}
                </ul>
            </div>
            </div>

            {/* Section Scores Breakdown */}
            {interpretation.section_scores && interpretation.section_scores.length > 0 && (
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg style={{ width: '18px', height: '18px', color: '#6366f1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Section Scores Breakdown
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  {interpretation.section_scores.map((section, idx) => {
                    const sectionNum = section.section_number || section.sectionNumber || (idx + 1);
                    let percentage;
                    if (section.score >= 0 && section.score <= 100 && section.score > 5) {
                      percentage = Math.round(section.score);
                    } else {
                      percentage = Math.round(((section.score - 1) / 4) * 100);
                    }
                    percentage = Math.min(100, Math.max(0, percentage));
                    
                    const sectionName = section.section_name || section.name;
                    let displayName = sectionName;
                    if (!displayName || displayName === 'undefined' || displayName.trim() === '') {
                      if (sectionNum >= 1 && sectionNum <= 4) {
                        const careerLabels = { 1: 'Cognitive Reasoning', 2: 'Aptitude Test', 3: 'Study Habits', 4: 'Learning Style' };
                        displayName = careerLabels[sectionNum] || `Section ${sectionNum}`;
                      } else if (sectionNum >= 5 && sectionNum <= 10) {
                        const riasecLabels = { 5: 'Realistic (R)', 6: 'Investigative (I)', 7: 'Artistic (A)', 8: 'Social (S)', 9: 'Enterprising (E)', 10: 'Conventional (C)' };
                        displayName = riasecLabels[sectionNum] || `Section ${sectionNum}`;
                      } else {
                        displayName = `Section ${sectionNum}`;
                      }
                    }
                    
                    const strokeColor = sectionNum <= 4 ? '#3b82f6' : '#8b5cf6';
                    const circumference = 2 * Math.PI * 40;
                    const offset = circumference * (1 - percentage / 100);
                    
                    return (
                      <div
                        key={sectionNum}
                        style={{
                          padding: '10px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          textAlign: 'center',
                          minWidth: '0',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{ 
                          fontSize: '9px', 
                          fontWeight: '500', 
                          color: '#64748b', 
                          marginBottom: '6px', 
                          minHeight: '28px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          lineHeight: '1.2',
                          wordWrap: 'break-word'
                        }}>
                          {displayName}
                        </div>
                        <div style={{ 
                          position: 'relative', 
                          width: '50px', 
                          height: '50px', 
                          margin: '0 auto 6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg 
                            width="50" 
                            height="50" 
                            viewBox="0 0 100 100" 
                            style={{ 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              transform: 'rotate(-90deg)'
                            }}
                          >
                            {/* Background circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="8"
                            />
                            {/* Progress circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              style={{
                                transition: 'stroke-dashoffset 0.3s ease'
                              }}
                            />
                          </svg>
                          <div style={{ 
                            position: 'relative',
                            zIndex: 1,
                            fontSize: '11px', 
                            fontWeight: 'bold', 
                            color: '#1e293b',
                            textAlign: 'center'
                          }}>
                            {percentage}%
                          </div>
                        </div>
                        <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500' }}>
                          {sectionNum <= 4 ? 'Career' : 'RIASEC'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Takeaway */}
      {interpretation?.readiness_status && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Key Takeaway</h2>
          <div style={{
            ...styles.card,
            background: interpretation.readiness_status === 'READY' 
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              : interpretation.readiness_status === 'PARTIALLY READY'
              ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderLeft: interpretation.readiness_status === 'READY'
              ? '4px solid #22c55e'
              : interpretation.readiness_status === 'PARTIALLY READY'
              ? '4px solid #f59e0b'
              : '4px solid #ef4444'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600',
              color: interpretation.readiness_status === 'READY'
                ? '#166534'
                : interpretation.readiness_status === 'PARTIALLY READY'
                ? '#92400e'
                : '#991b1b'
            }}>
              {interpretation.readiness_status === 'READY' && 'Ready for Career Planning'}
              {interpretation.readiness_status === 'PARTIALLY READY' && 'Preparation Stage'}
              {interpretation.readiness_status === 'NOT READY' && 'Exploration Stage'}
            </p>
          </div>
        </div>
      )}

      {/* Readiness Action Guidance */}
      {interpretation?.readiness_action_guidance && interpretation.readiness_action_guidance.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Readiness Action Guidance</h2>
          <div style={{
            ...styles.card,
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderLeft: '4px solid #0ea5e9'
          }}>
            <ul style={styles.bulletList}>
              {interpretation.readiness_action_guidance.map((action, idx) => (
                <li key={idx} style={{ ...styles.bulletItem, color: '#0c4a6e' }}>
                  <span style={{ ...styles.bulletMarker, color: '#0ea5e9' }}>•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Readiness Status */}
      {interpretation?.readiness_status && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Readiness Status</h2>
          <div style={{
            ...styles.card,
            background: interpretation.readiness_status === 'READY'
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              : interpretation.readiness_status === 'PARTIALLY READY'
              ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderLeft: interpretation.readiness_status === 'READY'
              ? '4px solid #22c55e'
              : interpretation.readiness_status === 'PARTIALLY READY'
              ? '4px solid #f59e0b'
              : '4px solid #ef4444'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' }}>Status</p>
              <p style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: interpretation.readiness_status === 'READY'
                  ? '#166534'
                  : interpretation.readiness_status === 'PARTIALLY READY'
                  ? '#92400e'
                  : '#991b1b'
              }}>
                {interpretation.readiness_status}
              </p>
            </div>
            {interpretation.readiness_explanation && (
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                {interpretation.readiness_explanation}
              </p>
            )}
            {interpretation.risk_level && (
              <div style={{ marginTop: '15px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' }}>Risk Level</p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '16px', 
                          fontWeight: '600',
                  color: interpretation.risk_level === 'LOW'
                    ? '#166534'
                    : interpretation.risk_level === 'MEDIUM'
                    ? '#92400e'
                    : '#991b1b'
                }}>
                  {interpretation.risk_level}
                </p>
              </div>
            )}
            {interpretation.risk_explanation && (
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                {interpretation.risk_explanation}
              </p>
            )}
          </div>
          </div>
        )}

      {/* Career Confidence */}
      {interpretation?.career_confidence_level && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Career Confidence Indicator</h2>
          <div style={{
            ...styles.card,
            background: interpretation.career_confidence_level === 'HIGH' || interpretation.career_confidence_level?.toUpperCase() === 'HIGH'
              ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              : interpretation.career_confidence_level === 'MODERATE' || interpretation.career_confidence_level?.toUpperCase() === 'MODERATE'
              ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderLeft: interpretation.career_confidence_level === 'HIGH' || interpretation.career_confidence_level?.toUpperCase() === 'HIGH'
              ? '4px solid #22c55e'
              : interpretation.career_confidence_level === 'MODERATE' || interpretation.career_confidence_level?.toUpperCase() === 'MODERATE'
              ? '4px solid #f59e0b'
              : '4px solid #ef4444'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b' }}>Confidence Level</p>
              <p style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: interpretation.career_confidence_level === 'HIGH' || interpretation.career_confidence_level?.toUpperCase() === 'HIGH'
                  ? '#166534'
                  : interpretation.career_confidence_level === 'MODERATE' || interpretation.career_confidence_level?.toUpperCase() === 'MODERATE'
                  ? '#92400e'
                  : '#991b1b'
              }}>
                {interpretation.career_confidence_level}
              </p>
            </div>
            {interpretation.career_confidence_explanation && (
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                {interpretation.career_confidence_explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Do Now vs Do Later */}
      {((interpretation?.do_now_actions && interpretation.do_now_actions.length > 0) || 
        (interpretation?.do_later_actions && interpretation.do_later_actions.length > 0)) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Action Items</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {interpretation.do_now_actions && interpretation.do_now_actions.length > 0 && (
          <div style={{
            ...styles.card,
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            borderLeft: '4px solid #ef4444'
          }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#991b1b' }}>
                  🔥 Do Now
                </h3>
                <ul style={styles.bulletList}>
                  {interpretation.do_now_actions.map((action, idx) => (
                    <li key={idx} style={{ ...styles.bulletItem, color: '#7f1d1d' }}>
                      <span style={{ ...styles.bulletMarker, color: '#ef4444' }}>•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interpretation.do_later_actions && interpretation.do_later_actions.length > 0 && (
              <div style={{
                ...styles.card,
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>
                  📋 Do Later
            </h3>
                <ul style={styles.bulletList}>
                  {interpretation.do_later_actions.map((action, idx) => (
                    <li key={idx} style={{ ...styles.bulletItem, color: '#1e3a8a' }}>
                      <span style={{ ...styles.bulletMarker, color: '#3b82f6' }}>•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Career Pathways */}
      {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (() => {
        // Calculate pathways dynamically (same logic as frontend component)
        const aspiringFieldsData = CAREER_PATHWAYS_DATA;
        const dimensions = riasecReport.dimensions || [];
        
        // Field RIASEC mapping (same as frontend component)
        const fieldRIASECMapping = {
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

        // STEP 1: NORMALIZE STUDENT RIASEC SCORES
        const rawScoreMap = {};
        dimensions.forEach(d => {
          if (d.code) rawScoreMap[d.code] = d.score || 0;
        });

        const total = (rawScoreMap.R || 0) + (rawScoreMap.I || 0) + (rawScoreMap.A || 0) + 
                      (rawScoreMap.S || 0) + (rawScoreMap.E || 0) + (rawScoreMap.C || 0);
        
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

        // STEP 2: BASE COMPATIBILITY FORMULA
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

          switch (field) {
            case 'Engineering':
              // Priority boost: R dominant
              if (dominantCode === "R") {
                finalScore = finalScore + 1;
              }
              if (An > Rn && Rn < 0.15) finalScore *= 0.75;
              break;
            case 'Data Science':
              if (Rn > In) finalScore *= 0.80;
              if (In > Math.max(Rn, An, Sn, En, Cn)) finalScore *= 1.10;
              break;
            case 'Data Analytics':
              if (An > Math.max(In, Cn)) finalScore *= 0.75;
              break;
            case 'Pure & Applied Science':
              if (En > Math.max(In, Rn)) finalScore *= 0.75;
              break;
            case 'Business & Management':
              if (Rn > Math.max(En, Cn)) finalScore *= 0.75;
              break;
            case 'Accounting':
              if (Rn >= Cn) finalScore *= 0.60;
              else if (In > Cn * 1.2) finalScore *= 0.75;
              else if (An > 0.20) finalScore *= 0.75;
              break;
            case 'Finance':
              if (An > Math.max(En, Cn)) finalScore *= 0.75;
              if (En > Math.max(Cn, In)) finalScore *= 1.05;
              break;
            case 'Humanities':
              if (Cn > Math.max(An, Sn)) finalScore *= 0.70;
              break;
            case 'Design':
              // Priority boost: A dominant
              if (dominantCode === "A") {
                finalScore = finalScore + 1;
              }
              if (Cn >= An) finalScore *= 0.60;
              break;
            case 'Media':
              if (Rn > Math.max(An, En)) finalScore *= 0.75;
              break;
            case 'Networking':
              if (An > Math.max(Rn, In)) finalScore *= 0.75;
              break;
            case 'Marketing':
              if (Cn > Math.max(En, An)) finalScore *= 0.70;
              break;
            case 'Law':
              if (An > Math.max(En, Cn, In)) finalScore *= 0.70;
              break;
            case 'Computer Applications':
              if (In > Math.max(Rn, Cn, An, Sn, En)) finalScore *= 1.15;
              if (Cn > Math.max(In, Rn) && (Rn + In) < 0.40) finalScore *= 0.70;
              break;
            case 'Medical & Health':
              if (Sn < 0.15) finalScore *= 0.65;
              else if (Rn > Math.max(In, Sn)) finalScore *= 0.75;
              break;
            case 'Hospitality':
              if (In > Math.max(Sn, En) && Sn < 0.20) finalScore *= 0.75;
              break;
          }
          return finalScore;
        };

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
          }).filter(f => f !== null);
          
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

        // RIASEC labels and colors
        const riasecLabels = {
          'R': 'Realistic',
          'I': 'Investigative',
          'A': 'Artistic',
          'S': 'Social',
          'E': 'Enterprising',
          'C': 'Conventional'
        };

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

        return (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Potential Career Pathways</h2>
            
            {/* Mapping Information Message */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#1e40af',
                lineHeight: '1.6'
              }}>
                <span style={{ fontWeight: '600' }}>Note:</span> Career fields are mapped to RIASEC personality clusters based on Holland's vocational theory. Some fields may appear in multiple clusters due to overlapping skill and personality requirements.
              </p>
            </div>
            
            <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>RIASEC Dimension</th>
                  <th colSpan={3} style={{...styles.tableHeader, textAlign: 'center'}}>Career Path</th>
                </tr>
              </thead>
              <tbody>
                {riasecRows.map((row, rowIdx) => {
                  const score = row.riasecScore || 0;
                  const matchLevel = score >= 30 ? 'HIGH' : score >= 15 ? 'MODERATE' : 'LOW';
                  const matchLabels = {
                    'HIGH': 'High Match',
                    'MODERATE': 'Moderate Match',
                    'LOW': 'Low Match'
                  };
                  const matchColors = getMatchLevelColor(matchLevel);
                  const dimensionColors = getDimensionColor(row.riasecCode);
                    
                    return (
                      <tr 
                      key={rowIdx} 
                        style={{ 
                        backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}
                    >
                      {/* RIASEC Dimension Column */}
                      <td style={styles.tableCell}>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: dimensionColors.bg,
                              color: dimensionColors.text,
                              border: `2px solid ${dimensionColors.border}`,
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {row.riasecCode}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                              {riasecLabels[row.riasecCode]}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                            <span style={{
                              ...styles.badge,
                              backgroundColor: matchColors.bg,
                              color: matchColors.text,
                              border: `1px solid ${matchColors.border}`,
                              fontSize: '10px',
                              padding: '3px 8px'
                            }}>
                              {matchLabels[matchLevel]}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b' }}>
                              <span>Score:</span>
                              <span style={{ fontWeight: '600', color: '#1e293b' }}>{score}%</span>
                            </div>
                          </div>
                          </div>
                    </td>
                      
                      {/* Career Field 1, Career Field 2, Career Field 3 Columns */}
                      {[0, 1, 2].map((fieldIdx) => {
                        const field = row.fields[fieldIdx];
                        if (!field) {
                              return (
                            <td key={fieldIdx} style={styles.tableCell}>
                              <span style={{ color: '#94a3b8', fontSize: '11px' }}>-</span>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={fieldIdx} style={styles.tableCell}>
                            <div style={{ marginBottom: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '4px',
                                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                                  color: '#ffffff',
                                  fontSize: '9px',
                        fontWeight: '600'
                                }}>
                                  {fieldIdx + 1}
                      </span>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                                  {field.aspiringField}
                                </span>
                          </div>
                              {field.careerPaths && field.careerPaths.length > 0 && (
                                <div style={{ paddingLeft: '26px' }}>
                                  {field.careerPaths.map((path, pathIdx) => (
                                    <div key={pathIdx} style={{ 
                                      fontSize: '10px', 
                                      color: '#475569', 
                                      marginBottom: '3px',
                                      lineHeight: '1.4'
                                    }}>
                                      • {path}
                                </div>
                              ))}
                            </div>
                              )}
                                </div>
                    </td>
                        );
                      })}
                  </tr>
                    );
                  })}
              </tbody>
            </table>
            </div>
      </div>
        );
      })()}

      {/* Counsellor Notes */}
      {counsellorNote && counsellorNote.notes && counsellorNote.notes.trim() && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Counsellor's Expert Notes</h2>
          <div style={{
            ...styles.card,
            backgroundColor: '#f3e8ff',
            borderLeft: '4px solid #9333ea'
          }}>
            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#64748b' }}>
              By {counsellorNote.counsellor_name || 'Counsellor'} • {new Date(counsellorNote.created_at || new Date()).toLocaleDateString()}
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {counsellorNote.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPDF;
