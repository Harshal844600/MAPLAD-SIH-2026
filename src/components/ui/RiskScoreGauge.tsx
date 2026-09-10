import React from 'react';
import { getRiskColor } from '../../design-system';

export interface RiskScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const { level, config } = getRiskColor(score);

  const radiusVal = 38;
  const circumference = 2 * Math.PI * radiusVal;
  // 270 degree arc (3/4 circle)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (Math.min(Math.max(score, 0), 100) / 100) * arcLength;

  const dim = {
    sm: { width: 80, height: 80, stroke: 5, fontSize: 'text-xl', labelSize: 'text-[9px]' },
    md: { width: 130, height: 130, stroke: 7, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { width: 180, height: 180, stroke: 9, fontSize: 'text-5xl', labelSize: 'text-sm' },
  }[size];

  // Dynamic gradient IDs for Risk color
  const gradientId = `gauge-gradient-${score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low'}`;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dim.width}
          height={dim.height}
          viewBox="0 0 100 100"
          className="transform -rotate-135 drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="gauge-gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="gauge-gradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="gauge-gradient-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="gauge-gradient-critical" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radiusVal}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={dim.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />

          {/* Glowing active arc fill */}
          <circle
            cx="50"
            cy="50"
            r={radiusVal}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={dim.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25 + strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numeric Readout in JetBrains Mono / Inter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-bold ${dim.fontSize} leading-none text-white tracking-tight`}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-mono text-gray-400 mt-1">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-2.5 font-mono font-semibold uppercase tracking-wider ${dim.labelSize} px-3 py-0.5 rounded-full border backdrop-blur-md ${config.bg} ${config.border} ${config.text} ${
            score >= 80 ? 'animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]' : ''
          }`}
        >
          {level}
        </span>
      )}
    </div>
  );
};
