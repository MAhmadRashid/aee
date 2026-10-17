"use client";

import React, { useState } from 'react';

interface ChartProps {
  data: { name: string; revenue: number }[];
}

export default function RevenueChart({ data }: ChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-neutral-500 text-xs tracking-wider uppercase">
        No revenue data available
      </div>
    );
  }

  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const width = 600;
  const height = 240;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map(d => d.revenue), 1000);
  // Round up maxVal to a clean ceiling
  const yMax = Math.ceil(maxVal / 1000) * 1000 || 1000;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.revenue / yMax) * chartHeight;
    return { x, y, ...d };
  });

  // Build smooth bezier curve
  const pathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${padding.top + chartHeight} L ${points[0].x},${padding.top + chartHeight} Z`;

  const yTicks = [0, yMax * 0.5, yMax];

  return (
    <div className="w-full h-64 mt-4 relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="revenueGoldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D4AF37" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Grid lines & Y-axis labels */}
        {yTicks.map((val, idx) => {
          const y = padding.top + chartHeight - (val / yMax) * chartHeight;
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#2a2a2a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="#666"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                Rs. {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Gradient fill */}
        <path d={areaD} fill="url(#revenueGoldGrad)" />

        {/* Line curve */}
        <path
          d={pathD}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
          filter="url(#goldGlow)"
        />

        {/* Interactive points & hover line */}
        {points.map((pt, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hit area */}
              <rect
                x={pt.x - chartWidth / (data.length * 2)}
                y={padding.top}
                width={chartWidth / data.length}
                height={chartHeight}
                fill="transparent"
              />

              {/* Hover vertical guideline */}
              {isHovered && (
                <line
                  x1={pt.x}
                  y1={padding.top}
                  x2={pt.x}
                  y2={padding.top + chartHeight}
                  stroke="#D4AF37"
                  strokeOpacity="0.5"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              )}

              {/* Point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5 : 3}
                fill={isHovered ? '#fff' : '#D4AF37'}
                stroke="#111"
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-200"
              />

              {/* X-axis label */}
              <text
                x={pt.x}
                y={height - 10}
                fill={isHovered ? '#D4AF37' : '#777'}
                fontSize="10"
                textAnchor="middle"
                className="font-sans transition-colors duration-200"
              >
                {pt.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-neutral-950/95 border border-[#D4AF37]/40 px-3 py-1.5 rounded-md shadow-2xl backdrop-blur-md z-20 text-center transition-all duration-150"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
          }}
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">{points[hoveredIndex].name}</div>
          <div className="text-xs font-bold text-[#D4AF37] font-mono">
            Rs. {points[hoveredIndex].revenue.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
