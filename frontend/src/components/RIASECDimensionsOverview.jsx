import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, FlaskConical, Palette, Users, Megaphone, Folder } from 'lucide-react';

function RIASECDimensionsOverview({ dimensions }) {
  if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) {
    return null;
  }

  const [hoveredDimension, setHoveredDimension] = useState(null);

  // Color palette - Recommended colors
  const getDimensionConfig = (code) => {
    const configs = {
      R: {
        name: 'Realistic',
        fullName: 'Realistic',
        description: 'Hands-on and practical',
        color: '#EF4444', // red-500
        colorDark: '#DC2626', // red-600
        bgLight: 'bg-red-50 dark:bg-red-900/20',
        bgDark: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-300 dark:border-red-700',
        icon: Wrench,
        category: 'Doers'
      },
      I: {
        name: 'Investigative',
        fullName: 'Investigative',
        description: 'Observant and reflective',
        color: '#3B82F6', // blue-500
        colorDark: '#2563EB', // blue-600
        bgLight: 'bg-blue-50 dark:bg-blue-900/20',
        bgDark: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700',
        icon: FlaskConical,
        category: 'Thinkers'
      },
      A: {
        name: 'Artistic',
        fullName: 'Artistic',
        description: 'Creative and original',
        color: '#A855F7', // purple-500
        colorDark: '#9333EA', // purple-600
        bgLight: 'bg-purple-50 dark:bg-purple-900/20',
        bgDark: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700',
        icon: Palette,
        category: 'Creators'
      },
      S: {
        name: 'Social',
        fullName: 'Social',
        description: 'Work with people',
        color: '#22C55E', // green-500
        colorDark: '#16A34A', // green-600
        bgLight: 'bg-green-50 dark:bg-green-900/20',
        bgDark: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-700',
        icon: Users,
        category: 'Helpers'
      },
      E: {
        name: 'Enterprising',
        fullName: 'Enterprising',
        description: 'Decisive and influential',
        color: '#F59E0B', // amber-500
        colorDark: '#D97706', // amber-600
        bgLight: 'bg-amber-50 dark:bg-amber-900/20',
        bgDark: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-700',
        icon: Megaphone,
        category: 'Persuaders'
      },
      C: {
        name: 'Conventional',
        fullName: 'Conventional',
        description: 'Structure and order',
        color: '#64748B', // slate-500
        colorDark: '#475569', // slate-600
        bgLight: 'bg-slate-50 dark:bg-slate-700/50',
        bgDark: 'bg-slate-100 dark:bg-slate-700',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-300 dark:border-slate-600',
        icon: Folder,
        category: 'Organizers'
      }
    };
    return configs[code] || configs.C;
  };

  const calculateMatchLevel = (score) => {
    if (score >= 30) return 'HIGH';
    if (score >= 15) return 'MODERATE';
    return 'LOW';
  };

  // Sort dimensions by score (highest first)
  const sortedDimensions = [...dimensions].sort((a, b) => (b.score || 0) - (a.score || 0));
  const top3Codes = sortedDimensions.slice(0, 3).map(d => d.code);

  // Get dimension data with config
  const dimensionData = dimensions.map(dim => {
    const config = getDimensionConfig(dim.code);
    const score = Math.round(dim.score || 0);
    const matchLevel = calculateMatchLevel(score);
    const isTop3 = top3Codes.includes(dim.code);
    
    return {
      ...dim,
      ...config,
      score,
      matchLevel,
      isTop3
    };
  });

  // Order: R, I, A, S, E, C (standard RIASEC order)
  const orderedDimensions = ['R', 'I', 'A', 'S', 'E', 'C'].map(code => 
    dimensionData.find(d => d.code === code)
  ).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-0"
    >
      {/* Header */}
      <div className="text-left -mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0 leading-tight">
          RIASEC Dimensions Overview
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-0 leading-tight -mt-1">
          Your unique blend of vocational interests and personality traits
        </p>
      </div>

      {/* Desktop: Hexagonal Layout */}
      <div className="hidden lg:block -mt-2">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-center -my-2">
            {/* Hexagon Container */}
            <div className="relative" style={{ width: '600px', height: '600px' }}>
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))' }}
              >
                {/* Hexagon segments */}
                {orderedDimensions.map((dim, index) => {
                  const angle = (index * 60 - 90) * (Math.PI / 180); // Start from top
                  const centerX = 200;
                  const centerY = 200;
                  const radius = 150;
                  
                  // Calculate triangle points
                  const x1 = centerX;
                  const y1 = centerY;
                  const angle1 = angle;
                  const angle2 = angle + (Math.PI / 3);
                  const x2 = centerX + radius * Math.cos(angle1);
                  const y2 = centerY + radius * Math.sin(angle1);
                  const x3 = centerX + radius * Math.cos(angle2);
                  const y3 = centerY + radius * Math.sin(angle2);

                  const isHovered = hoveredDimension === dim.code;
                  const opacity = isHovered ? 1 : (dim.score >= 30 ? 1 : dim.score >= 15 ? 0.8 : 0.6);
                  const strokeWidth = dim.isTop3 ? 3 : 1;

                  return (
                    <g key={dim.code}>
                      {/* Triangle segment */}
                      <polygon
                        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                        fill={dim.color}
                        fillOpacity={opacity}
                        stroke={dim.colorDark}
                        strokeWidth={strokeWidth}
                        className="cursor-pointer transition-all duration-300"
                        style={{
                          filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.3))' : 'none',
                        }}
                        onMouseEnter={() => setHoveredDimension(dim.code)}
                        onMouseLeave={() => setHoveredDimension(null)}
                      />
                      
                      {/* Dimension name */}
                      <text
                        x={centerX + (radius * 0.65) * Math.cos(angle + Math.PI / 6)}
                        y={centerY + (radius * 0.65) * Math.sin(angle + Math.PI / 6) - 8}
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
                      
                      {/* Code */}
                      <text
                        x={centerX + (radius * 0.65) * Math.cos(angle + Math.PI / 6)}
                        y={centerY + (radius * 0.65) * Math.sin(angle + Math.PI / 6) + 8}
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

              {/* Outer category labels */}
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
                        top: `${(labelY / 600) * 100}%`,
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

        {/* Dimension Cards Below Hexagon */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 -mt-2">
          {orderedDimensions.map((dim) => {
            const Icon = dim.icon;
            const isHovered = hoveredDimension === dim.code;
            
            return (
              <motion.div
                key={dim.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (orderedDimensions.indexOf(dim) * 0.05) }}
                onMouseEnter={() => setHoveredDimension(dim.code)}
                onMouseLeave={() => setHoveredDimension(null)}
                className={`
                  ${dim.bgLight} ${dim.border} border-2 rounded-xl p-4 cursor-pointer
                  transition-all duration-300
                  ${isHovered ? 'shadow-lg scale-105' : 'shadow-md'}
                  ${dim.isTop3 ? 'ring-2 ring-offset-2' : ''}
                `}
                style={{
                  ringColor: dim.color,
                  borderColor: dim.isTop3 ? dim.color : undefined
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: dim.color, color: '#ffffff' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm ${dim.text}`}>
                      {dim.fullName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {dim.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-2xl font-bold ${dim.text}`}>
                    {dim.score}%
                  </span>
                  {dim.isTop3 && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Top 3
                    </span>
                  )}
                </div>
                <div className="mt-2 w-full h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 1, delay: 0.3 + (orderedDimensions.indexOf(dim) * 0.1) }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: dim.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet: Card Grid Layout */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orderedDimensions.map((dim) => {
            const Icon = dim.icon;
            
            return (
              <motion.div
                key={dim.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (orderedDimensions.indexOf(dim) * 0.05) }}
                className={`
                  ${dim.bgDark} ${dim.border} border-2 rounded-xl p-5
                  ${dim.isTop3 ? 'ring-2 ring-offset-2 shadow-lg' : 'shadow-md'}
                `}
                style={{
                  ringColor: dim.color,
                  borderColor: dim.isTop3 ? dim.color : undefined
                }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: dim.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${dim.text}`}>
                        {dim.fullName}
                      </h3>
                      {dim.isTop3 && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Top 3
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {dim.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-3xl font-bold ${dim.text}`}>
                        {dim.score}%
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${dim.bgLight} ${dim.text}`}>
                        {dim.matchLevel} MATCH
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 w-full h-2.5 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 1, delay: 0.2 + (orderedDimensions.indexOf(dim) * 0.1) }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: dim.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default RIASECDimensionsOverview;

