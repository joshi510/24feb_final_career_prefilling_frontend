import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RIASECCard from './pathway/RIASECCard.jsx';

const RIASEC_LABELS = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

/** Hexagon + category ring — colors aligned with RIASECCard themes */
const HEX_BY_CODE = {
  R: {
    name: 'Realistic',
    color: '#EF4444',
    colorDark: '#DC2626',
    category: 'Doers'
  },
  I: {
    name: 'Investigative',
    color: '#3B82F6',
    colorDark: '#2563EB',
    category: 'Thinkers'
  },
  A: {
    name: 'Artistic',
    color: '#A855F7',
    colorDark: '#9333EA',
    category: 'Creators'
  },
  S: {
    name: 'Social',
    color: '#10B981',
    colorDark: '#059669',
    category: 'Helpers'
  },
  E: {
    name: 'Enterprising',
    color: '#F97316',
    colorDark: '#EA580C',
    category: 'Persuaders'
  },
  C: {
    name: 'Conventional',
    color: '#475569',
    colorDark: '#334155',
    category: 'Organizers'
  }
};

const RIASEC_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];

function RIASECDimensionsOverview({ dimensions }) {
  const [hoveredDimension, setHoveredDimension] = useState(null);

  if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) {
    return null;
  }

  const scoreByCode = Object.fromEntries(
    RIASEC_ORDER.map((code) => {
      const d = dimensions.find((x) => x.code === code);
      return [code, Math.round(Number(d?.score) || 0)];
    })
  );

  const top3Codes = [...RIASEC_ORDER]
    .map((code) => ({ code, score: scoreByCode[code] || 0 }))
    .sort((a, b) => b.score - a.score || a.code.localeCompare(b.code))
    .slice(0, 3)
    .map((x) => x.code);

  const orderedDimensions = RIASEC_ORDER.map((code) => {
    const hex = HEX_BY_CODE[code];
    const score = scoreByCode[code] || 0;
    return {
      code,
      score,
      name: hex.name,
      color: hex.color,
      colorDark: hex.colorDark,
      category: hex.category,
      isTop3: top3Codes.includes(code)
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-0"
    >
      <div className="text-left -mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0 leading-tight">
          Your Personality Types
        </h2>
      </div>

      <div className="hidden lg:block -mt-2">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-center -my-2">
            <div className="relative" style={{ width: '600px', height: '600px' }}>
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))' }}
              >
                {orderedDimensions.map((dim, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const centerX = 200;
                  const centerY = 200;
                  const radius = 150;
                  const angle1 = angle;
                  const angle2 = angle + Math.PI / 3;
                  const x2 = centerX + radius * Math.cos(angle1);
                  const y2 = centerY + radius * Math.sin(angle1);
                  const x3 = centerX + radius * Math.cos(angle2);
                  const y3 = centerY + radius * Math.sin(angle2);

                  const isHovered = hoveredDimension === dim.code;
                  const opacity = isHovered ? 1 : dim.score >= 30 ? 1 : dim.score >= 15 ? 0.8 : 0.6;
                  const strokeWidth = dim.isTop3 ? 3 : 1;

                  return (
                    <g key={dim.code}>
                      <polygon
                        points={`${centerX},${centerY} ${x2},${y2} ${x3},${y3}`}
                        fill={dim.color}
                        fillOpacity={opacity}
                        stroke={dim.colorDark}
                        strokeWidth={strokeWidth}
                        className="cursor-pointer transition-all duration-300"
                        style={{
                          filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))' : 'none'
                        }}
                        onMouseEnter={() => setHoveredDimension(dim.code)}
                        onMouseLeave={() => setHoveredDimension(null)}
                      />
                      <text
                        x={centerX + radius * 0.65 * Math.cos(angle + Math.PI / 6)}
                        y={centerY + radius * 0.65 * Math.sin(angle + Math.PI / 6) - 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="16"
                        fontWeight="bold"
                        className="pointer-events-none"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        {dim.name}
                      </text>
                      <text
                        x={centerX + radius * 0.65 * Math.cos(angle + Math.PI / 6)}
                        y={centerY + radius * 0.65 * Math.sin(angle + Math.PI / 6) + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="600"
                        className="pointer-events-none"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                      >
                        ({dim.code})
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {orderedDimensions.map((dim, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180);
                  const labelRadius = 190;
                  const labelX = 300 + labelRadius * Math.cos(angle);
                  const labelY = 300 + labelRadius * Math.sin(angle);

                  return (
                    <div
                      key={dim.code}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(labelX / 600) * 100}%`,
                        top: `${(labelY / 600) * 100}%`
                      }}
                    >
                      <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded">
                        {dim.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 -mt-2">
          {orderedDimensions.map((dim, idx) => (
            <motion.div
              key={dim.code}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + idx * 0.04 }}
              onMouseEnter={() => setHoveredDimension(dim.code)}
              onMouseLeave={() => setHoveredDimension(null)}
              className="rounded-2xl"
              style={
                dim.isTop3
                  ? { boxShadow: `0 0 0 2px ${dim.color}, 0 4px 14px rgba(15, 23, 42, 0.08)` }
                  : undefined
              }
            >
              <RIASECCard
                code={dim.code}
                name={RIASEC_LABELS[dim.code]}
                score={dim.score}
                showTopBadge={dim.isTop3}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orderedDimensions.map((dim, idx) => (
            <motion.div
              key={dim.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + idx * 0.04 }}
              className="rounded-2xl"
              style={
                dim.isTop3
                  ? { boxShadow: `0 0 0 2px ${dim.color}, 0 4px 14px rgba(15, 23, 42, 0.08)` }
                  : undefined
              }
            >
              <RIASECCard
                code={dim.code}
                name={RIASEC_LABELS[dim.code]}
                score={dim.score}
                showTopBadge={dim.isTop3}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default RIASECDimensionsOverview;
