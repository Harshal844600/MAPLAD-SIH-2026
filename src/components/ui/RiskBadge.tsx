import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RiskLevel } from '../../types';

export interface RiskBadgeProps {
  score?: number;
  level?: RiskLevel;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  showScore = true,
  size = 'md',
  className = '',
}) => {
  const computedLevel: RiskLevel =
    level ||
    (score !== undefined
      ? score >= 80
        ? 'CRITICAL'
        : score >= 60
        ? 'HIGH'
        : score >= 30
        ? 'MEDIUM'
        : 'LOW'
      : 'LOW');

  const config = {
    CRITICAL: {
      bg: 'bg-[#8B2635]/25',
      border: 'border-[#8B2635]',
      text: 'text-[#fca5a5]',
      icon: <ShieldAlert className="shrink-0 text-[#fca5a5]" strokeWidth={1.5} />,
      label: 'CRITICAL RISK',
    },
    HIGH: {
      bg: 'bg-[#d97706]/20',
      border: 'border-[#d97706]',
      text: 'text-[#fbbf24]',
      icon: <AlertTriangle className="shrink-0 text-[#fbbf24]" strokeWidth={1.5} />,
      label: 'ELEVATED RISK',
    },
    MEDIUM: {
      bg: 'bg-[#C9A962]/15',
      border: 'border-[#C9A962]/60',
      text: 'text-[#C9A962]',
      icon: <AlertCircle className="shrink-0 text-[#C9A962]" strokeWidth={1.5} />,
      label: 'MODERATE RISK',
    },
    LOW: {
      bg: 'bg-[#2e7d32]/20',
      border: 'border-[#2e7d32]',
      text: 'text-[#a5d6a7]',
      icon: <CheckCircle2 className="shrink-0 text-[#a5d6a7]" strokeWidth={1.5} />,
      label: 'LOW RISK',
    },
  }[computedLevel];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 min-h-[22px]',
    md: 'text-xs px-2.5 py-1 gap-2 min-h-[28px]',
    lg: 'text-sm px-4 py-1.5 gap-2.5 min-h-[36px]',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4.5 h-4.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-['Cinzel'] font-bold uppercase tracking-[0.15em] border rounded-[2px] ${config.bg} ${config.border} ${config.text} ${sizeClasses} ${className}`}
    >
      <span className={iconSizes}>{config.icon}</span>
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 pl-1.5 border-l border-current font-mono font-bold text-[#E8DFD4]">
          {score}/100
        </span>
      )}
    </span>
  );
};
