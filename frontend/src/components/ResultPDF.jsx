import React, { useMemo } from 'react';

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

      {/* RIASEC Radar Chart Summary */}
      {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>RIASEC Dimensions Overview</h2>
          <div style={styles.infoBox}>
            Normalization Logic: The Likert scale (1–5) is linearly normalized to a 0–100 range using min-max scaling: Normalized Score = (value - minimum) / (maximum - minimum)
          </div>
          {(() => {
            const sortedDimensions = [...riasecReport.dimensions].sort((a, b) => (b.score || 0) - (a.score || 0));
            const dominantTypes = sortedDimensions.slice(0, 2).map(d => d.title || d.code).join(' + ');
            const secondaryType = sortedDimensions[2] ? sortedDimensions[2].title || sortedDimensions[2].code : null;
            return (
              <div style={styles.card}>
                <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  <strong>Dominant Types:</strong> {dominantTypes}
                  {secondaryType && <span>. <strong>Secondary Influence:</strong> {secondaryType}</span>}
                </p>
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
                  <div style={styles.infoBox}>
                    Normalization Logic: The Likert scale (1–5) is linearly normalized to a 0–100 range using min-max scaling: Normalized Score = (value - minimum) / (maximum - minimum)
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
            padding: '30px',
            textAlign: 'center'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={styles.scoreDisplay}>
                {Math.round(interpretation.overall_percentage || 0)}%
              </div>
              <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: '600', color: '#334155' }}>Overall Performance</p>
              <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                  Percentage Normalization: Scores are normalized to a 0–100% scale for consistent interpretation across all assessment dimensions.
                </p>
              </div>
            </div>
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
        
        const fieldRIASECMapping = {
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

        const dimensions = riasecReport.dimensions || [];
        
        // STEP 1: NORMALIZE STUDENT RIASEC SCORES (MANDATORY)
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

          switch (field) {
            case 'Engineering':
              if (An > Rn && Rn < 0.15) finalScore *= 0.75;
              break;
            case 'Tech':
              if (Cn > Math.max(Rn, In) && (Rn + In) < 0.30) finalScore *= 0.70;
              break;
            case 'Medical & Health':
              if (Sn < 0.15) finalScore *= 0.65;
              else if (Rn > Math.max(In, Sn)) finalScore *= 0.75;
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
            case 'Hospitality':
              if (In > Math.max(Sn, En) && Sn < 0.20) finalScore *= 0.75;
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
          const aDominantWeight = fieldRIASECMapping[a.field]?.[dominantCode] || 0;
          const bDominantWeight = fieldRIASECMapping[b.field]?.[dominantCode] || 0;
          return bDominantWeight - aDominantWeight;
        });

        // STEP 5: STABILITY MARGIN
        const bestScore = fieldScores[0]?.finalScore || 0;
        const secondBestScore = fieldScores[1]?.finalScore || 0;
        const scoreDifference = bestScore - secondBestScore;
        const stabilityThreshold = 0.12;

        let finalRanking = [...fieldScores];
        if (scoreDifference < stabilityThreshold && fieldScores.length > 1) {
          const dominantCluster = dominantCode;
          const clusterFields = {
            'I': ['Data Science', 'Pure & Applied Science', 'Tech', 'Computer Applications', 'Data Analytics'],
            'R': ['Engineering', 'Tech', 'Networking', 'Computer Applications'],
            'A': ['Design', 'Media', 'Humanities'],
            'E': ['Business & Management', 'Finance', 'Marketing', 'Law'],
            'C': ['Accounting', 'Finance', 'Business & Management'],
            'S': ['Medical & Health', 'Humanities', 'Hospitality']
          };

          const preferredFields = clusterFields[dominantCluster] || [];
          
          finalRanking = fieldScores.map(item => {
            if (preferredFields.includes(item.field) && scoreDifference < stabilityThreshold) {
              return {
                ...item,
                finalScore: item.finalScore * 1.05
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

        const top3Fields = finalRanking.slice(0, 3).map(f => f.field);
        const bestField = finalRanking[0]?.field || null;

        const allRows = [];
        aspiringFieldsData.forEach(item => {
          const fieldData = finalRanking.find(f => f.field === item.aspiringField);
          const finalCompatibility = fieldData?.finalScore || 0;
          const allCareerPaths = item.careerPaths || [];
          const bestPathForField = allCareerPaths[0] || null;
          
          allRows.push({
            aspiringField: item.aspiringField,
            careerPaths: allCareerPaths,
            bestCareerPath: bestPathForField,
            riasecMix: riasecMix,
            compatibility: finalCompatibility
          });
        });
        
        allRows.sort((a, b) => b.compatibility - a.compatibility);
        const bestPath = allRows[0]?.bestCareerPath || null;

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
            <div style={styles.card}>
            <table style={styles.table}>
              <thead>
                <tr>
                    <th style={styles.tableHeader}>Aspiring Field</th>
                  <th style={styles.tableHeader}>RIASEC Mix</th>
                    <th style={styles.tableHeader}>Career Path</th>
                  <th style={styles.tableHeader}>Professional Persona</th>
                    <th style={styles.tableHeader}>Core Tasks & Focus</th>
                    <th style={styles.tableHeader}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                  {allRows.map((row, idx) => {
                    const isBestField = row.aspiringField === bestField;
                    const isBestPath = row.careerPaths && row.careerPaths.includes(bestPath);
                    const isHighlighted = isBestField || isBestPath;
                    const fieldRank = top3Fields.indexOf(row.aspiringField);
                    
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
                    const confColors = getConfidenceColor(confidence.level);
                    
                    return (
                      <tr 
                        key={idx} 
                        style={{ 
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          ...(isHighlighted ? {
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(59,130,246,0.18))',
                            border: '1px solid rgba(99,102,241,0.35)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
                          } : {})
                        }}
                      >
                        <td style={{ ...styles.tableCell, fontWeight: '600', color: isBestField ? '#6366f1' : '#1e293b' }}>
                          {row.aspiringField}
                    </td>
                    <td style={styles.tableCell}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {row.riasecMix ? row.riasecMix.split('-').map((code, codeIdx) => {
                              const codeColors = getDimensionColor(code);
                              return (
                                <span
                                  key={codeIdx}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: codeColors.bg,
                                    color: codeColors.text,
                                    border: `1px solid ${codeColors.border}`,
                                    fontSize: '10px',
                        fontWeight: '600'
                                  }}
                                >
                                  {code}
                      </span>
                              );
                            }) : '-'}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          {row.careerPaths && row.careerPaths.length > 0 ? (
                            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', lineHeight: '1.6' }}>
                              {row.careerPaths.map((path, pathIdx) => (
                                <li 
                                  key={pathIdx}
                                  style={{ 
                                    marginBottom: '4px',
                                    color: isBestPath && path === bestPath ? '#6366f1' : '#334155',
                                    fontWeight: isBestPath && path === bestPath ? '600' : '400'
                                  }}
                                >
                                  {path}
                                </li>
                              ))}
                            </ol>
                          ) : '-'}
                        </td>
                        <td style={styles.tableCell}>
                          {row.careerPaths && row.careerPaths.length > 0 ? (
                            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                              {row.careerPaths.map((path, pathIdx) => (
                                <div key={pathIdx} style={{ marginBottom: '4px' }}>
                                  {calculatePersona(path)}
                                </div>
                              ))}
                            </div>
                          ) : '-'}
                        </td>
                        <td style={styles.tableCell}>
                          {row.careerPaths && row.careerPaths.length > 0 ? (
                            <div style={{ fontSize: '11px', lineHeight: '1.5', color: '#475569' }}>
                              {row.careerPaths.map((path, pathIdx) => (
                                <div key={pathIdx} style={{ marginBottom: '4px' }}>
                                  {calculateFocus(path)}
                                </div>
                              ))}
                            </div>
                          ) : '-'}
                    </td>
                        <td style={styles.tableCell}>
                          <div style={{
                            ...styles.badge,
                            backgroundColor: confColors.bg,
                            color: confColors.text,
                            border: `1px solid ${confColors.border}`
                          }}>
                            {confidence.label}
                          </div>
                    </td>
                  </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
            
            {/* Confidence Level Definitions */}
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                Confidence Level Definitions
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#dcfce7', border: '1px solid #22c55e', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>High Confidence</div>
                  <div style={{ fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
                    Strong alignment between pathway requirements and your RIASEC profile. Primary and secondary traits match top scores with minimal gaps.
                  </div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>Moderate Confidence</div>
                  <div style={{ fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
                    Reasonable alignment with your profile. Some traits align well, though there may be moderate gaps between pathway needs and your scores.
                  </div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>Low Confidence</div>
                  <div style={{ fontSize: '10px', color: '#334155', lineHeight: '1.4' }}>
                    Limited alignment between pathway requirements and your current RIASEC profile. Significant gaps suggest this may require additional development.
                  </div>
                </div>
              </div>
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
