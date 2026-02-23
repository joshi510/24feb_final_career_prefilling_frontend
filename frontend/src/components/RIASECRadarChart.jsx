import React from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

function RIASECRadarChart({ dimensions }) {
  if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) {
    return null;
  }

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#475569' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#fff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  // Map dimensions to chart data
  const chartData = dimensions.map(dim => ({
    category: dim.code,
    fullName: dim.title,
    value: Math.round(dim.score || 0)
  }));

  // Calculate dominant types for summary
  const sortedDimensions = [...dimensions].sort((a, b) => (b.score || 0) - (a.score || 0));
  const dominantTypes = sortedDimensions.slice(0, 2).map(d => d.title || d.code).join(' + ');
  const secondaryType = sortedDimensions[2] ? sortedDimensions[2].title || sortedDimensions[2].code : null;

  // Color mapping for each dimension
  const dimensionColors = {
    R: { fill: '#f97316', stroke: '#ea580c' }, // Orange
    I: { fill: '#3b82f6', stroke: '#2563eb' }, // Blue
    A: { fill: '#a855f7', stroke: '#9333ea' }, // Purple
    S: { fill: '#22c55e', stroke: '#16a34a' }, // Green
    E: { fill: '#ef4444', stroke: '#dc2626' }, // Red
    C: { fill: '#64748b', stroke: '#475569' }  // Slate
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, color: '#e5e7eb', fontSize: '14px' }}>
            {data.fullName}
          </p>
          <p style={{ margin: '6px 0 0 0', color: 'rgba(99,102,241,0.9)', fontWeight: '600', fontSize: '13px' }}>
            Score: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: 'radial-gradient(circle at top, #0f172a, #020617)',
        borderRadius: '18px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Title */}
      <h3 style={{
        fontSize: '22px',
        fontWeight: 600,
        letterSpacing: '0.4px',
        color: '#e5e7eb',
        marginBottom: '8px',
        marginTop: 0
      }}>
        RIASEC Dimensions Overview
      </h3>
      
      {/* RIASEC Score Badges - Moved above chart */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'center'
      }}>
        {dimensions.map((dim) => (
          <div
            key={dim.code}
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '11px',
              color: '#e5e7eb',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span style={{ fontWeight: 600 }}>{dim.code}:</span>
            <span>{Math.round(dim.score || 0)}%</span>
          </div>
        ))}
      </div>

      {/* Glassmorphism Chart Container */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '18px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
        padding: '18px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="w-full" style={{ height: '280px', minHeight: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <PolarGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: 'rgba(229,231,235,0.8)', fontSize: 12, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 10 }}
                tickCount={5}
              />
              {chartData.map((item, index) => {
                return (
                  <Radar
                    key={index}
                    name={item.fullName}
                    dataKey="value"
                    stroke="rgba(99,102,241,0.9)"
                    fill="rgba(99,102,241,0.18)"
                    fillOpacity={1}
                    strokeWidth={3}
                    dot={{ fill: 'rgba(99,102,241,0.9)', r: 5 }}
                    filter="drop-shadow(0 0 8px rgba(99,102,241,0.35))"
                  />
                );
              })}
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Radar Chart Summary */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        <p style={{
          fontSize: '13px',
          color: 'rgba(229,231,235,0.9)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          <span style={{ fontWeight: 600 }}>Dominant Types:</span> {dominantTypes}
          {secondaryType && (
            <>
              <br style={{ marginTop: '8px' }} />
              <span style={{ fontWeight: 600 }}>Secondary Influence:</span> {secondaryType}
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default RIASECRadarChart;

