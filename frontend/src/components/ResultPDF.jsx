import React, { useMemo } from 'react';
import { getFieldRecommendations } from '../utils/careerEngine.js';
import { aliasCareerTitleForDisplay } from '../utils/careerTitleAliases.js';
import {
  buildCounsellorReport,
  buildTopPathwayRowsForDisplay,
  generateStudentCareerDescription,
  getArchetypeTagline,
  resolveArchetypeDisplayName,
} from '../utils/reportEngine.js';
import { getDimensionMatchLevel } from '../utils/riasecPresentation.js';
import {
  simplifyReportText,
  simplifyRiskExplanationDisplay,
  filterSecondaryReportLinesRemovingCoreAdvice,
  removeCoreAdviceSentencesFromSecondaryText,
  friendlyReadinessLabel,
  friendlyRiskLabel,
  friendlyCareerDirectionHeadline,
  matchTierToDisplayLabel,
  mapDecisionRiskLevelDisplay,
  mapStabilityDisplay,
  keyTakeawayMessage
} from '../utils/simplifiedReportCopy.js';

/** Same 3-column padding as RIASECCareerPathways.jsx */
function paddedFields(fields) {
  const out = [...(fields || [])];
  while (out.length < 3) out.push(null);
  return out.slice(0, 3);
}

/** API may return JSON strings for array fields */
function coerceStringArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter((x) => x != null && String(x).trim() !== '');
  if (typeof value === 'string') {
    const t = value.trim();
    if (!t) return [];
    try {
      const p = JSON.parse(t);
      return Array.isArray(p) ? p.filter((x) => x != null && String(x).trim() !== '') : [t];
    } catch {
      return [t];
    }
  }
  return [];
}

/** Split "Question N: body" into heading + body for counsellor PDF layout */
function parseDiscussionLine(line) {
  const s = String(line || '');
  const m = s.match(/^Question\s+(\d+):\s*(.*)$/);
  if (m) return { num: m[1], body: m[2] };
  return { num: '', body: s };
}

/** Design system — PDF presentation only */
const RIASEC_COLORS = {
  R: { primary: '#FF6B35', light: '#FFE8DF', label: 'Realistic' },
  I: { primary: '#4A90D9', light: '#E3F0FB', label: 'Investigative' },
  A: { primary: '#9B59B6', light: '#F0E8F8', label: 'Artistic' },
  S: { primary: '#27AE60', light: '#E3F8EC', label: 'Social' },
  E: { primary: '#E74C3C', light: '#FCE8E8', label: 'Enterprising' },
  C: { primary: '#F39C12', light: '#FEF4E3', label: 'Conventional' }
};

const BRAND_COLORS = {
  primary: '#2C3E50',
  secondary: '#3498DB',
  accent: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  light: '#F8F9FA',
  white: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#7F8C8D'
};

const RIASEC_EMOJI = { R: '⚙️', I: '🔬', A: '🎨', S: '🤝', E: '📈', C: '📋' };

/** Same orientation phrases as RIASECCard / FieldCard (student UI parity) */
const RIASEC_ORIENTATION_SUBTITLE = {
  R: 'Hands-on & practical',
  I: 'Analysis & inquiry',
  A: 'Creative & expressive',
  S: 'Helping & people-focused',
  E: 'Leadership & influence',
  C: 'Structured & detail-focused'
};

function pdfRiasecTitleLine(code) {
  const c = String(code || 'C').toUpperCase();
  const rc = RIASEC_COLORS[c] || RIASEC_COLORS.C;
  return `${c}·${rc.label}`;
}

/** Same path as public folder; avoid CSS filters on logo — html2canvas often breaks them */
const PDF_LOGO_SRC = '/images/logo-transparent.png';

function PdfFooterLogo() {
  return (
    <img
      src={PDF_LOGO_SRC}
      alt="TOPS Technologies"
      style={{
        height: 22,
        width: 'auto',
        maxWidth: 88,
        objectFit: 'contain',
        objectPosition: 'left center',
        display: 'block',
        flexShrink: 0
      }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}

function PdfPageFrame({ pageNum, children }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100%',
        padding: '0 0 8px 0',
        marginBottom: '28px',
        borderBottom: '2px solid #e8ecf0'
      }}
    >
      {children}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid #dde4ea',
          fontSize: '9px',
          color: BRAND_COLORS.textLight,
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <PdfFooterLogo />
        </div>
        <span style={{ textAlign: 'center' }}>Career Assessment Report</span>
        <span style={{ fontWeight: 600, color: BRAND_COLORS.secondary }}>Page {pageNum}</span>
      </div>
    </div>
  );
}

/** SVG ring — html2canvas-friendly */
function CircularScoreRing({ percent, color, size = 88, stroke = 8, label, sublabel }) {
  const p = Math.min(100, Math.max(0, Math.round(Number(percent) || 0)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - p / 100);
  return (
    <div style={{ textAlign: 'center', width: size + 16 }}>
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#eceff1"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: size > 100 ? 22 : 16, fontWeight: 800, color, lineHeight: 1 }}>{p}%</span>
        </div>
      </div>
      {label ? (
        <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: BRAND_COLORS.text }}>{label}</div>
      ) : null}
      {sublabel ? (
        <div style={{ marginTop: 2, fontSize: 9, color: BRAND_COLORS.textLight }}>{sublabel}</div>
      ) : null}
    </div>
  );
}

function HorizontalScoreBar({ label, sublabel, percent, color, barMaxWidth = 280 }) {
  const p = Math.min(100, Math.max(0, Math.round(Number(percent) || 0)));
  return (
    <div style={{ display: 'flex', alignItems: sublabel ? 'flex-start' : 'center', gap: 10, marginBottom: 10 }}>
      <div
        style={{
          width: 118,
          flexShrink: 0,
          textAlign: 'right'
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: BRAND_COLORS.text, lineHeight: 1.25 }}>{label}</div>
        {sublabel ? (
          <div style={{ marginTop: 3, fontSize: 8, fontWeight: 600, color: '#64748b', lineHeight: 1.25 }}>{sublabel}</div>
        ) : null}
      </div>
      <div
        style={{
          flex: 1,
          maxWidth: barMaxWidth,
          height: 10,
          background: '#ecf0f1',
          borderRadius: 5,
          overflow: 'hidden',
          marginTop: sublabel ? 2 : 0
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: '100%',
            background: color,
            borderRadius: 5,
            minWidth: p > 0 ? 4 : 0
          }}
        />
      </div>
      <div style={{ width: 36, fontSize: 10, fontWeight: 800, color, marginTop: sublabel ? 2 : 0 }}>{p}%</div>
    </div>
  );
}

function SectionRibbon({ title, accentColor }) {
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '0.02em',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/** Semi-circular gauge for overall readiness */
function ReadinessGauge({ percent }) {
  const p = Math.min(100, Math.max(0, Math.round(Number(percent) || 0)));
  const w = 200;
  const h = 110;
  const stroke = 14;
  const r = (w - stroke) / 2;
  const arcLen = Math.PI * r;
  const offset = arcLen * (1 - p / 100);
  return (
    <div style={{ textAlign: 'center', margin: '12px 0 8px' }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <path
          d={`M ${stroke / 2} ${h - 4} A ${r} ${r} 0 0 1 ${w - stroke / 2} ${h - 4}`}
          fill="none"
          stroke="#ecf0f1"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${h - 4} A ${r} ${r} 0 0 1 ${w - stroke / 2} ${h - 4}`}
          fill="none"
          stroke={p >= 66 ? BRAND_COLORS.success : p >= 40 ? BRAND_COLORS.warning : BRAND_COLORS.secondary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{ marginTop: -36 }}>
        <span style={{ fontSize: 36, fontWeight: 900, color: BRAND_COLORS.primary }}>{p}%</span>
        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_COLORS.textLight, marginTop: 4 }}>Overall readiness</div>
      </div>
    </div>
  );
}

function scoreBandStyle(percentage) {
  const p = Number(percentage) || 0;
  if (p >= 60) {
    return {
      grad: 'linear-gradient(145deg, #d5f5e3 0%, #eafaf1 50%, #ffffff 100%)',
      border: BRAND_COLORS.success,
      accent: BRAND_COLORS.success
    };
  }
  if (p >= 40) {
    return {
      grad: 'linear-gradient(145deg, #fdebd0 0%, #fef9e7 50%, #ffffff 100%)',
      border: BRAND_COLORS.warning,
      accent: BRAND_COLORS.warning
    };
  }
  return {
    grad: 'linear-gradient(145deg, #fadbd8 0%, #fdedec 50%, #ffffff 100%)',
    border: BRAND_COLORS.accent,
    accent: BRAND_COLORS.accent
  };
}

function ResultPDF({ interpretation, counsellorNote, user, riasecReport, showDiscussionForCounsellor = false }) {
  const pathwayPayload = useMemo(() => {
    if (!riasecReport?.dimensions?.length) return null;
    const fieldAnalysis = getFieldRecommendations(riasecReport.dimensions);
    const report = buildCounsellorReport(riasecReport.dimensions, fieldAnalysis);
    return { fieldAnalysis, report };
  }, [riasecReport]);

  /** Same source as ResultPage CareerConfidence when RIASEC dimensions exist */
  const pdfRiasecConfidence = useMemo(() => {
    const fa = pathwayPayload?.fieldAnalysis;
    if (fa?.confidence && fa.confidenceMessage) {
      return {
        level: String(fa.confidence).toUpperCase(),
        explanation: fa.confidenceMessage,
        scrubExplanation: false
      };
    }
    if (interpretation?.career_confidence_level && interpretation?.career_confidence_explanation) {
      return {
        level: interpretation.career_confidence_level,
        explanation: interpretation.career_confidence_explanation,
        scrubExplanation: true
      };
    }
    return null;
  }, [
    pathwayPayload?.fieldAnalysis,
    interpretation?.career_confidence_level,
    interpretation?.career_confidence_explanation
  ]);

  const displayPathwayRows = useMemo(() => {
    if (!pathwayPayload?.fieldAnalysis?.pathwayRows?.length) return [];
    return buildTopPathwayRowsForDisplay(pathwayPayload.fieldAnalysis, { topRows: 3, topFields: 3, topCareers: 3 });
  }, [pathwayPayload]);

  const pdfArchetype = useMemo(() => {
    if (!pathwayPayload?.fieldAnalysis?.state) return null;
    const displayName = resolveArchetypeDisplayName(pathwayPayload.fieldAnalysis.state);
    return { displayName, tagline: getArchetypeTagline(displayName) };
  }, [pathwayPayload]);

  const doNowList = useMemo(
    () => filterSecondaryReportLinesRemovingCoreAdvice(coerceStringArray(interpretation?.do_now_actions)),
    [interpretation]
  );
  const doLaterList = useMemo(
    () => filterSecondaryReportLinesRemovingCoreAdvice(coerceStringArray(interpretation?.do_later_actions)),
    [interpretation]
  );

  const pdfRiskExplanationDisplay = useMemo(
    () =>
      simplifyRiskExplanationDisplay(
        interpretation?.risk_explanation_human,
        interpretation?.risk_explanation
      ),
    [interpretation?.risk_explanation_human, interpretation?.risk_explanation]
  );

  const pdfCareerConfidenceExplanationDisplay = useMemo(() => {
    if (!pdfRiasecConfidence?.explanation) return '';
    if (pdfRiasecConfidence.scrubExplanation) {
      return removeCoreAdviceSentencesFromSecondaryText(pdfRiasecConfidence.explanation);
    }
    return pdfRiasecConfidence.explanation;
  }, [pdfRiasecConfidence]);

  const orderedRiasecDimensions = useMemo(() => {
    if (!riasecReport?.dimensions?.length) return [];
    return ['R', 'I', 'A', 'S', 'E', 'C']
      .map((code) => riasecReport.dimensions.find((d) => d.code === code))
      .filter(Boolean);
  }, [riasecReport]);

  const topThreeRiasecTraits = useMemo(() => {
    if (!riasecReport?.dimensions?.length) return [];
    return [...riasecReport.dimensions].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
  }, [riasecReport]);

  const sortedRiasecByScore = useMemo(() => {
    if (!riasecReport?.dimensions?.length) return [];
    return [...riasecReport.dimensions].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [riasecReport]);

  const calculateMatchLevel = (score) => {
    if (score >= 30) return 'GREAT FIT';
    if (score >= 15) return 'GOOD FIT';
    return 'SOME FIT';
  };

  const getMatchLevelColor = (matchLevel) => {
    const m = String(matchLevel || '').toUpperCase();
    if (m.includes('GREAT') || m.includes('HIGH')) {
      return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
    }
    if (m.includes('GOOD') || m.includes('MODERATE')) {
      return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    }
    return { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' };
  };

  const getDimensionColor = (code) => {
    const rc = RIASEC_COLORS[code] || RIASEC_COLORS.C;
    return {
      bg: rc.light,
      border: rc.primary,
      text: BRAND_COLORS.text
    };
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
      backgroundColor: BRAND_COLORS.light,
      color: BRAND_COLORS.text,
      padding: '48px 56px',
      fontFamily: 'Helvetica, Arial, "Segoe UI", sans-serif',
      fontSize: '13px',
      lineHeight: '1.6',
      maxWidth: '800px',
      margin: '0 auto'
    },
    header: {
      background: `linear-gradient(125deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 55%, #5dade2 100%)`,
      color: '#ffffff',
      padding: '28px 32px',
      borderRadius: '16px',
      marginBottom: '24px',
      boxShadow: '0 12px 40px rgba(44, 62, 80, 0.25)'
    },
    headerTitle: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '8px',
      letterSpacing: '-0.02em'
    },
    headerInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginTop: '15px'
    },
    headerItem: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.92)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    section: {
      marginBottom: '30px',
      pageBreakInside: 'avoid'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '800',
      color: BRAND_COLORS.primary,
      marginBottom: '18px',
      paddingBottom: '8px',
      borderBottom: `3px solid ${BRAND_COLORS.secondary}`,
      letterSpacing: '-0.02em'
    },
    card: {
      backgroundColor: BRAND_COLORS.white,
      border: '1px solid #e8ecf0',
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 4px 24px rgba(44, 62, 80, 0.08)'
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
      background: `linear-gradient(90deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
      color: '#ffffff',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '700',
      fontSize: '12px',
      border: '1px solid rgba(255,255,255,0.2)'
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
      {/* —— Page 1: Cover —— */}
      <PdfPageFrame pageNum={1}>
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 10px 36px rgba(44, 62, 80, 0.15)',
            background: BRAND_COLORS.white
          }}
        >
          <div style={{ ...styles.header, marginBottom: 0, borderRadius: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    color: 'rgba(255,255,255,0.88)',
                    marginBottom: 8
                  }}
                >
                  TOPS TECHNOLOGIES
                </div>
                <h1 style={{ ...styles.headerTitle, marginBottom: 6 }}>Career Assessment Report</h1>
                <div
                  style={{
                    width: 72,
                    height: 4,
                    background: 'rgba(255,255,255,0.45)',
                    borderRadius: 2,
                    marginBottom: 16
                  }}
                />
                <div style={styles.headerInfo}>
                  {user?.full_name && (
                    <div style={styles.headerItem}>
                      <span style={{ fontWeight: '700' }}>Student:</span> {user.full_name}
                    </div>
                  )}
                  <div style={styles.headerItem}>
                    <span style={{ fontWeight: '700' }}>Date:</span>{' '}
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  {user?.email && (
                    <div style={{ ...styles.headerItem, gridColumn: '1 / -1' }}>
                      <span style={{ fontWeight: '700' }}>Email:</span> {user.email}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="TOPS Technologies"
              >
                <img
                  src={PDF_LOGO_SRC}
                  alt="TOPS Technologies"
                  style={{
                    maxWidth: 128,
                    maxHeight: 48,
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ padding: '28px 24px 32px', background: BRAND_COLORS.white }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: 28
              }}
            >
              <CircularScoreRing
                percent={interpretation?.overall_percentage ?? 0}
                color={BRAND_COLORS.secondary}
                size={132}
                stroke={11}
                label="Overall Readiness Score"
              />
              <div style={{ flex: '1 1 240px', maxWidth: 420 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: BRAND_COLORS.textLight,
                    marginBottom: 10
                  }}
                >
                  TOP TRAIT HIGHLIGHTS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {topThreeRiasecTraits.length > 0 ? (
                    topThreeRiasecTraits.map((d) => {
                      const rc = RIASEC_COLORS[d.code] || RIASEC_COLORS.C;
                      const sub = RIASEC_ORIENTATION_SUBTITLE[d.code] || RIASEC_ORIENTATION_SUBTITLE.C;
                      return (
                        <span
                          key={d.code}
                          style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 4,
                            padding: '8px 14px',
                            borderRadius: 14,
                            background: rc.light,
                            color: BRAND_COLORS.text,
                            border: `2px solid ${rc.primary}`
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span>{RIASEC_EMOJI[d.code] || '✨'}</span>
                            <span style={{ fontSize: 12, fontWeight: 800 }}>{pdfRiasecTitleLine(d.code)}</span>
                            <span style={{ color: rc.primary, fontSize: 12, fontWeight: 800 }}>
                              {Math.round(d.score || 0)}%
                            </span>
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 600, color: '#475569', lineHeight: 1.35, paddingLeft: 28 }}>
                            {sub}
                          </span>
                        </span>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: 12, color: BRAND_COLORS.textLight, fontStyle: 'italic' }}>
                      Trait scores appear after RIASEC assessment data is available.
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #ecf0f1' }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: BRAND_COLORS.textLight,
                      marginBottom: 6
                    }}
                  >
                    CAREER ARCHETYPE
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: BRAND_COLORS.primary, lineHeight: 1.2 }}>
                    {pdfArchetype?.displayName || '—'}
                  </div>
                  {pdfArchetype?.tagline ? (
                    <p style={{ margin: '10px 0 0', fontSize: 12, color: BRAND_COLORS.textLight, lineHeight: 1.55 }}>
                      {pdfArchetype.tagline}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PdfPageFrame>

      <PdfPageFrame pageNum={2}>
        <SectionRibbon title="Your RIASEC Profile" accentColor={BRAND_COLORS.secondary} />

        {orderedRiasecDimensions.length > 0 && (
          <div
            style={{
              ...styles.card,
              background: 'linear-gradient(180deg, #ffffff 0%, #f3f8fc 100%)',
              border: '1px solid #d6e4f0',
              marginBottom: 20
            }}
          >
            <h3 style={{ ...styles.cardTitle, color: BRAND_COLORS.primary, marginBottom: 16 }}>
              Circular score overview
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
                marginBottom: 8
              }}
            >
              {orderedRiasecDimensions.map((dimension) => {
                const rc = RIASEC_COLORS[dimension.code] || RIASEC_COLORS.C;
                const score = Math.round(dimension.score || 0);
                const matchTier = getDimensionMatchLevel(score);
                const tierLabel = matchTierToDisplayLabel(matchTier);
                return (
                  <div
                    key={dimension.code}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 6 }}>{RIASEC_EMOJI[dimension.code] || '✨'}</div>
                    <CircularScoreRing percent={score} color={rc.primary} size={84} stroke={8} />
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 11,
                        fontWeight: 800,
                        color: BRAND_COLORS.text,
                        textAlign: 'center',
                        lineHeight: 1.25
                      }}
                    >
                      {pdfRiasecTitleLine(dimension.code)}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 9,
                        fontWeight: 600,
                        color: '#64748b',
                        textAlign: 'center',
                        lineHeight: 1.35,
                        maxWidth: 120
                      }}
                    >
                      {RIASEC_ORIENTATION_SUBTITLE[dimension.code] || RIASEC_ORIENTATION_SUBTITLE.C}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: 8,
                        backgroundColor: getMatchLevelColor(matchTier).bg,
                        color: getMatchLevelColor(matchTier).text,
                        border: `1px solid ${getMatchLevelColor(matchTier).border}`,
                        textAlign: 'center'
                      }}
                    >
                      {tierLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            <h3 style={{ ...styles.cardTitle, color: BRAND_COLORS.primary, marginTop: 20, marginBottom: 12 }}>
              Profile comparison (bars)
            </h3>
            {sortedRiasecByScore.map((dimension) => {
              const rc = RIASEC_COLORS[dimension.code] || RIASEC_COLORS.C;
              return (
                <HorizontalScoreBar
                  key={`pdf-bar-${dimension.code}`}
                  label={pdfRiasecTitleLine(dimension.code)}
                  sublabel={RIASEC_ORIENTATION_SUBTITLE[dimension.code] || RIASEC_ORIENTATION_SUBTITLE.C}
                  percent={dimension.score}
                  color={rc.primary}
                  barMaxWidth={360}
                />
              );
            })}

            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: 'linear-gradient(90deg, #e8f4fc 0%, #ffffff 100%)',
                borderRadius: 10,
                border: '1px solid #d4e9f7'
              }}
            >
              <p style={{ margin: 0, fontSize: 12, color: BRAND_COLORS.text, lineHeight: 1.55 }}>
                <strong>Your top types:</strong>{' '}
                {sortedRiasecByScore
                  .slice(0, 2)
                  .map((d) => pdfRiasecTitleLine(d.code))
                  .join(' + ')}
                {sortedRiasecByScore[2] ? (
                  <span>
                    . <strong>Also strong:</strong>{' '}
                    {pdfRiasecTitleLine(sortedRiasecByScore[2].code)}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        )}

        {/* RIASEC Profile Section — API narrative blocks */}
        {riasecReport && riasecReport.riasecProfile && (
      <div style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, fontSize: 17 }}>Insights from your responses</h2>
        
        {/* Decision Risk */}
        {riasecReport.riasecProfile.decisionRisk && (
          <div style={{
            ...styles.card,
              backgroundColor: getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').bg,
              borderLeft: `4px solid ${getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').border}`
            }}>
              <h3 style={styles.cardTitle}>Career Readiness Check</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px' }}>
              <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#64748b' }}>Career Readiness</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').text }}>
                  {mapDecisionRiskLevelDisplay(riasecReport.riasecProfile.decisionRisk.level)}
                </p>
              </div>
              <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#64748b' }}>Stability</p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: getRiskColor(riasecReport.riasecProfile.decisionRisk.level || 'Moderate Risk').text }}>
                  {mapStabilityDisplay(riasecReport.riasecProfile.decisionRisk.stability)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Qualities */}
        {riasecReport.riasecProfile.topQualities && riasecReport.riasecProfile.topQualities.length > 0 && (
          <div style={{
            ...styles.card,
              backgroundColor: '#fffbeb',
            borderLeft: '4px solid #f59e0b'
          }}>
              <h3 style={styles.cardTitle}>Your Strong Points</h3>
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
                    {simplifyReportText(quality)}
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
                    <td style={styles.tableCell}>
                      {RIASEC_COLORS[trait.code] ? (
                        <div>
                          <div style={{ fontWeight: 700 }}>{pdfRiasecTitleLine(trait.code)}</div>
                          <div style={{ fontSize: 9, color: '#64748b', marginTop: 3, lineHeight: 1.3 }}>
                            {RIASEC_ORIENTATION_SUBTITLE[trait.code] || RIASEC_ORIENTATION_SUBTITLE.C}
                          </div>
                        </div>
                      ) : (
                        trait.label
                      )}
                    </td>
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
      </PdfPageFrame>

      {/* Detailed Dimension Analysis — Page 3 */}
      <PdfPageFrame pageNum={3}>
        {riasecReport && riasecReport.dimensions && riasecReport.dimensions.length > 0 && (
        <div style={styles.section}>
          <SectionRibbon title="Dimension deep-dive" accentColor={BRAND_COLORS.warning} />
          <h2 style={{ ...styles.sectionTitle, marginTop: 4 }}>What Each Type Means For You</h2>
          {riasecReport.dimensions.map((dimension, index) => {
            const colors = getDimensionColor(dimension.code);
            const rc = RIASEC_COLORS[dimension.code] || RIASEC_COLORS.C;
            const score = Math.round(dimension.score || 0);
            const matchLevel = simplifyReportText(dimension.matchLevel || calculateMatchLevel(score));
            const matchColors = getMatchLevelColor(matchLevel);
            
            return (
              <div key={dimension.code} style={{
                ...styles.card,
                backgroundColor: colors.bg,
                borderLeft: `5px solid ${colors.border}`,
                marginBottom: '20px',
                boxShadow: '0 6px 22px rgba(44, 62, 80, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: colors.text }}>
                      {pdfRiasecTitleLine(dimension.code)}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#64748b', lineHeight: 1.4 }}>
                      {RIASEC_ORIENTATION_SUBTITLE[dimension.code] || RIASEC_ORIENTATION_SUBTITLE.C}
                    </p>
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

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#334155' }}>
                      {simplifyReportText(dimension.tagline || `${dimension.title} tasks.`)}
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
                      About You
                    </h4>
                    {dimension.personalizedAnalysis.includes('•') ? (
                      <ul style={styles.bulletList}>
                        {formatBulletPoints(dimension.personalizedAnalysis).map((point, idx) => (
                          <li key={idx} style={styles.bulletItem}>
                            <span style={styles.bulletMarker}>•</span>
                            {simplifyReportText(point)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                        {simplifyReportText(dimension.personalizedAnalysis)}
                      </p>
                    )}
                  </div>
                )}

                {(dimension.coreStrengths?.length > 0 || dimension.growthAreas?.length > 0) && (
                  <div
                    style={{
                      marginTop: 16,
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 16
                    }}
                  >
                    {dimension.coreStrengths && dimension.coreStrengths.length > 0 && (
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.65)',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                      >
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: 13,
                            fontWeight: 800,
                            color: BRAND_COLORS.success
                          }}
                        >
                          Strengths
                        </h4>
                        <ul style={styles.bulletList}>
                          {dimension.coreStrengths.map((strength, idx) => (
                            <li key={idx} style={styles.bulletItem}>
                              <span style={styles.bulletMarker}>•</span>
                              {simplifyReportText(strength)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {dimension.growthAreas && dimension.growthAreas.length > 0 && (
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.65)',
                          border: '1px solid rgba(0,0,0,0.06)'
                        }}
                      >
                        <h4
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: 13,
                            fontWeight: 800,
                            color: BRAND_COLORS.warning
                          }}
                        >
                          Growth areas
                        </h4>
                        <ul style={styles.bulletList}>
                          {dimension.growthAreas.map((area, idx) => (
                            <li key={idx} style={styles.bulletItem}>
                              <span style={styles.bulletMarker}>•</span>
                              {simplifyReportText(area)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {dimension.workStylePreferences && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                      Best Work Environment
                    </h4>
                    {dimension.workStylePreferences.includes('•') ? (
                      <ul style={styles.bulletList}>
                        {formatBulletPoints(dimension.workStylePreferences).map((point, idx) => (
                          <li key={idx} style={styles.bulletItem}>
                            <span style={styles.bulletMarker}>•</span>
                            {simplifyReportText(point)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                        {simplifyReportText(dimension.workStylePreferences)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </PdfPageFrame>

      {/* "Are you ready?" page removed (per requirement) */}

      <PdfPageFrame pageNum={4}>
        {interpretation && (
          <div style={styles.section}>
            <SectionRibbon title="Score breakdown" accentColor={BRAND_COLORS.success} />
            <h2 style={styles.sectionTitle}>Score Summary</h2>
            <div
              style={{
                ...styles.card,
                border: 'none',
                borderRadius: 18,
                padding: 28,
                background: 'linear-gradient(160deg, #ffffff 0%, #eef6ff 55%, #ffffff 100%)',
                boxShadow: '0 10px 36px rgba(44, 62, 80, 0.1)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 900,
                    background: `linear-gradient(135deg, ${BRAND_COLORS.secondary} 0%, ${BRAND_COLORS.primary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: 10,
                    lineHeight: 1.1
                  }}
                >
                  {Math.round(interpretation.overall_percentage || 0)}%
                </div>
                <p style={{ margin: '5px 0', fontSize: 16, fontWeight: 700, color: BRAND_COLORS.text }}>Overall Score</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: 'linear-gradient(145deg, #e8f8ef, #ffffff)',
                    border: `1px solid ${BRAND_COLORS.success}44`
                  }}
                >
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: BRAND_COLORS.success,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: BRAND_COLORS.success,
                        borderRadius: '50%'
                      }}
                    />
                    Your Strengths
                  </h4>
                  <p style={{ fontSize: 11, color: BRAND_COLORS.textLight, fontStyle: 'italic', marginBottom: 10 }}>
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
                            strengthsArray = interpretation.strengths.split('\n').filter((s) => s.trim());
                          }
                        }
                      }
                      return strengthsArray.length > 0 ? (
                        strengthsArray.slice(0, 3).map((strength, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: 12,
                              color: BRAND_COLORS.text,
                              marginBottom: 8,
                              paddingLeft: 16,
                              position: 'relative'
                            }}
                          >
                            <span style={{ position: 'absolute', left: 0, color: BRAND_COLORS.success }}>•</span>
                            {simplifyReportText(strength)}
                          </li>
                        ))
                      ) : (
                        <li style={{ fontSize: 12, color: BRAND_COLORS.textLight, fontStyle: 'italic' }}>
                          No specific strengths identified yet
                        </li>
                      );
                    })()}
                  </ul>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: 'linear-gradient(145deg, #fff4e6, #ffffff)',
                    border: `1px solid ${BRAND_COLORS.warning}55`
                  }}
                >
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: BRAND_COLORS.warning,
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: BRAND_COLORS.warning,
                        borderRadius: '50%'
                      }}
                    />
                    Areas to Improve
                  </h4>
                  <p style={{ fontSize: 11, color: BRAND_COLORS.textLight, fontStyle: 'italic', marginBottom: 10 }}>
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
                            weaknessesArray = source.split('\n').filter((s) => s.trim());
                          }
                        }
                      }
                      return weaknessesArray.length > 0 ? (
                        weaknessesArray.slice(0, 3).map((weakness, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: 12,
                              color: BRAND_COLORS.text,
                              marginBottom: 8,
                              paddingLeft: 16,
                              position: 'relative'
                            }}
                          >
                            <span style={{ position: 'absolute', left: 0, color: BRAND_COLORS.warning }}>•</span>
                            {simplifyReportText(weakness)}
                          </li>
                        ))
                      ) : (
                        <li style={{ fontSize: 12, color: BRAND_COLORS.textLight, fontStyle: 'italic' }}>
                          No specific improvement areas identified yet
                        </li>
                      );
                    })()}
                  </ul>
                </div>
              </div>

              {interpretation.section_scores && interpretation.section_scores.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 22, borderTop: '1px solid #dce6ef' }}>
                  <h4
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: BRAND_COLORS.primary,
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📊</span> Your scores by section
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {interpretation.section_scores
                      .filter((section, idx) => {
                        const sectionNum = section.section_number || section.sectionNumber || idx + 1;
                        return Number(sectionNum) >= 1 && Number(sectionNum) <= 4;
                      })
                      .map((section, idx) => {
                      const sectionNum = section.section_number || section.sectionNumber || idx + 1;
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
                          const careerLabels = {
                            1: 'Cognitive Reasoning',
                            2: 'Aptitude Test',
                            3: 'Study Habits',
                            4: 'Learning Style'
                          };
                          displayName = careerLabels[sectionNum] || `Section ${sectionNum}`;
                        } else {
                          displayName = `Section ${sectionNum}`;
                        }
                      }
                      const band = scoreBandStyle(percentage);
                      const strokeColor = BRAND_COLORS.secondary;
                      const circumference = 2 * Math.PI * 36;
                      const offset = circumference * (1 - percentage / 100);
                      return (
                        <div
                          key={sectionNum}
                          style={{
                            padding: 14,
                            borderRadius: 14,
                            textAlign: 'center',
                            minWidth: 0,
                            background: band.grad,
                            border: `2px solid ${band.border}55`,
                            boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
                          }}
                        >
                          <div
                            style={{
                              fontSize: 28,
                              fontWeight: 900,
                              color: band.accent,
                              lineHeight: 1.1
                            }}
                          >
                            {percentage}%
                          </div>
                          <div
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color: BRAND_COLORS.text,
                              marginTop: 8,
                              minHeight: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1.25
                            }}
                          >
                            {displayName}
                          </div>
                          <div
                            style={{
                              position: 'relative',
                              width: 44,
                              height: 44,
                              margin: '10px auto 0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <svg
                              width={44}
                              height={44}
                              viewBox="0 0 100 100"
                              style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
                            >
                              <circle cx="50" cy="50" r="36" fill="none" stroke="#e8ecf0" strokeWidth="9" />
                              <circle
                                cx="50"
                                cy="50"
                                r="36"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="9"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                              />
                            </svg>
                            <span style={{ position: 'relative', zIndex: 1, fontSize: 9, fontWeight: 800, color: BRAND_COLORS.text }}>
                              Career
                            </span>
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
      </PdfPageFrame>

      <PdfPageFrame pageNum={5}>
      <SectionRibbon title="Career pathways" accentColor={BRAND_COLORS.warning} />
      {/* Potential Career Pathways — same engine as RIASECCareerPathways (careerEngine + reportEngine) */}
      {pathwayPayload?.fieldAnalysis?.valid === false && pathwayPayload.fieldAnalysis?.confidenceMessage && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Potential Career Pathways</h2>
          <div style={{ ...styles.card, backgroundColor: '#f8fafc', borderLeft: '4px solid #94a3b8' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              <strong>Match Strength: Low</strong>
              <span style={{ display: 'block', marginTop: '8px' }}>
                {simplifyReportText(pathwayPayload.fieldAnalysis.confidenceMessage)}
              </span>
            </p>
          </div>
        </div>
      )}
      {pathwayPayload?.fieldAnalysis?.valid !== false && pathwayPayload?.fieldAnalysis?.pathwayRows?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Great Fit Career Pathway</h2>
          <div style={styles.card}>
            {displayPathwayRows.map((row, rowIdx) => {
              const score = row.riasecScore || 0;
              const matchLevel = getDimensionMatchLevel(score);
              const matchColors = getMatchLevelColor(matchLevel);

              return (
                <div
                  key={row.riasecCode || rowIdx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    backgroundColor: '#ffffff',
                    marginBottom: 14,
                    padding: 14,
                    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div
                      style={{
                        width: 136,
                        flexShrink: 0,
                        borderRadius: 12,
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#f8fafc',
                        padding: 12
                      }}
                    >
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#0f172a', lineHeight: 1.25 }}>
                        {pdfRiasecTitleLine(row.riasecCode)}
                      </p>
                      <p style={{ margin: '6px 0 0 0', fontSize: 10, fontWeight: 600, color: '#475569', lineHeight: 1.35 }}>
                        {RIASEC_ORIENTATION_SUBTITLE[row.riasecCode] || RIASEC_ORIENTATION_SUBTITLE.C}
                      </p>
                      <span
                        style={{
                          ...styles.badge,
                          marginTop: 8,
                          fontSize: 10,
                          backgroundColor: matchColors.bg,
                          color: matchColors.text,
                          border: `1px solid ${matchColors.border}`
                        }}
                      >
                        {matchTierToDisplayLabel(matchLevel)} • {score}%
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: 12, fontWeight: 800, color: '#0f172a' }}>
                        {row.riasecCode} - All Career Pathway Options
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                        {paddedFields(row.fields).map((field, fieldIdx) => {
                          if (!field) {
                            return (
                              <div
                                key={`empty-${fieldIdx}`}
                                style={{
                                  border: '1px dashed #cbd5e1',
                                borderRadius: 12,
                                  padding: 10,
                                minHeight: 84,
                                  color: '#94a3b8',
                                  fontSize: 11
                                }}
                              >
                                —
                              </div>
                            );
                          }

                          const careersToShow = field.careers || [];
                          return (
                            <div
                              key={`${row.riasecCode}-${field.aspiringField}-${fieldIdx}`}
                              style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: 12,
                                padding: 12,
                                backgroundColor: '#f8fafc',
                                minHeight: 84
                              }}
                            >
                              <div style={{ marginBottom: 7 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                                  <span style={{ color: '#4f46e5', fontVariantNumeric: 'tabular-nums' }}>{fieldIdx + 1}.</span>{' '}
                                  {field.aspiringField}
                                </div>
                                <div style={{ marginTop: 4, fontSize: 9, fontWeight: 600, color: '#64748b', lineHeight: 1.35 }}>
                                  {RIASEC_ORIENTATION_SUBTITLE[row.riasecCode] || RIASEC_ORIENTATION_SUBTITLE.C}
                                </div>
                              </div>
                              <div style={{ fontSize: 10.5, color: '#334155' }}>
                                {careersToShow.map((c, pathIdx) => (
                                  <div key={pathIdx} style={{ marginBottom: 6, lineHeight: 1.35 }}>
                                    <div style={{ fontWeight: 700, fontSize: 10.5 }}>
                                      <span style={{ color: '#4f46e5', fontVariantNumeric: 'tabular-nums' }}>
                                        {pathIdx + 1}.
                                      </span>{' '}
                                      {aliasCareerTitleForDisplay(c.title)}
                                      {c.scorePercent != null ? (
                                        <span style={{ fontWeight: 600, color: '#4f46e5', marginLeft: 4 }}>
                                          {c.scorePercent}%
                                        </span>
                                      ) : null}
                                    </div>
                                    {pathwayPayload.fieldAnalysis.state ? (
                                      <div style={{ marginLeft: 10, marginTop: 2, color: '#64748b' }}>
                                        {simplifyReportText(
                                          generateStudentCareerDescription(c.title, pathwayPayload.fieldAnalysis.state)
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {riasecReport?.dimensions?.length > 0 &&
        pathwayPayload?.fieldAnalysis &&
        pathwayPayload.fieldAnalysis.valid !== false &&
        (!pathwayPayload.fieldAnalysis.pathwayRows || pathwayPayload.fieldAnalysis.pathwayRows.length === 0) && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Potential Career Pathways</h2>
          <div style={{ ...styles.card, backgroundColor: '#f8fafc', borderLeft: '4px solid #94a3b8' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Unable to calculate career pathways for this profile.
            </p>
          </div>
        </div>
      )}
      </PdfPageFrame>

      <PdfPageFrame pageNum={6}>
      {pdfArchetype && pathwayPayload?.fieldAnalysis?.valid !== false && (
        <div style={styles.section}>
          <SectionRibbon title="Your career archetype" accentColor={BRAND_COLORS.secondary} />
          <h2 style={styles.sectionTitle}>Your Career Archetype</h2>
          <div
            style={{
              ...styles.card,
              background: 'linear-gradient(135deg, #e8f4fc 0%, #f5eef8 100%)',
              border: '2px solid rgba(52, 152, 219, 0.35)',
              borderRadius: 16,
              padding: 22,
              boxShadow: '0 8px 28px rgba(155, 89, 182, 0.12)'
            }}
          >
            <p style={{ margin: '0 0 10px 0', fontSize: 22, fontWeight: 900, color: BRAND_COLORS.primary }}>
              {pdfArchetype.displayName}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: BRAND_COLORS.secondary, lineHeight: 1.6, fontWeight: 600 }}>
              {pdfArchetype.tagline}
            </p>
          </div>
        </div>
      )}

      {/* Counsellor Notes removed (per UI requirement) */}

      {showDiscussionForCounsellor &&
        pathwayPayload?.report?.discussionPrompts?.length > 0 &&
        pathwayPayload?.fieldAnalysis?.valid !== false && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Discussion Questions for Counsellor</h2>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
              Use these to start the conversation with the student
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pathwayPayload.report.discussionPrompts.map((line, idx) => {
                const { num, body } = parseDiscussionLine(line);
                const labelNum = num || String(idx + 1);
                return (
                  <div
                    key={`pdf-dq-${labelNum}-${idx}`}
                    style={{
                      ...styles.card,
                      backgroundColor: '#eef2ff',
                      borderLeft: '4px solid #6366f1',
                      padding: '14px 16px'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#312e81' }}>Question {labelNum}</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.55 }}>{body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Important information — same themes as ResultPage parent disclaimer */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Important Information for Parents and Students</h2>
        <div style={{ ...styles.card, backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            <strong>What this report means:</strong> This report shows the student&apos;s personality type, strengths, and
            best-fit career areas based on their answers.
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            <strong>What this report does NOT mean:</strong> This is not an intelligence test. A lower score does not mean
            failure. It just means the student needs more time to explore.
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            <strong>Next steps:</strong> Talk to a career counsellor to understand these results better and make a plan.
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontStyle: 'italic', lineHeight: 1.5 }}>
            This report gives general career guidance only. Please talk to a qualified career counsellor for detailed advice.
          </p>
        </div>
      </div>


      {/* Counsellor Notes removed (per UI requirement) */}
      </PdfPageFrame>
    </div>
  );
}

export default ResultPDF;
