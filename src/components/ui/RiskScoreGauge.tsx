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
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75;

  const dim = {
    sm: { width: 70, height: 70, stroke: 4, fontSize: 'text-xl', labelSize: 'text-[9px]' },
    md: { width: 120, height: 120, stroke: 6, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { width: 170, height: 170, stroke: 8, fontSize: 'text-5xl', labelSize: 'text-sm' },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dim.width}
          height={dim.height}
          viewBox="0 0 100 100"
          className="transform -rotate-135"
        >
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radiusVal}
            fill="none"
            stroke="#3D332B"
            strokeWidth={dim.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          {/* Risk fill arc */}
          <circle
            cx="50"
            cy="50"
            r={radiusVal}
            fill="none"
            stroke={score >= 80 ? '#8B2635' : score >= 60 ? '#d97706' : '#C9A962'}
            strokeWidth={dim.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Text with AnimatedCounter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-['Cormorant_Garamond'] font-bold ${dim.fontSize} leading-none text-[#E8DFD4]`}>
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-['Cinzel'] text-[#9C8B7A] mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-2 font-['Cinzel'] font-bold uppercase tracking-[0.2em] ${dim.labelSize} px-2.5 py-0.5 border rounded-[2px] ${config.bg} ${config.border} ${config.text} ${score >= 80 ? 'animate-pulse' : ''}`}
        >
          {level}
        </span>
      )}
    </div>
  );
};
