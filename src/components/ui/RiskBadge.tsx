import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { RiskLevel } from '../../types';

export interface RiskBadgeProps {
  score?: number;
  level?: RiskLevel;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  code?: string; // Optional code like FIN-COST-001 or GEO-DUP-001
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  showScore = true,
  size = 'md',
  className = '',
  code,
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
      bg: 'bg-rose-950/40 light:bg-rose-100/90',
      border: 'border-rose-500/40 light:border-rose-300',
      text: 'text-rose-300 light:text-rose-800',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)] light:shadow-none',
      icon: <ShieldAlert className="shrink-0 text-rose-400 light:text-rose-600" strokeWidth={1.75} />,
      label: 'CRITICAL',
    },
    HIGH: {
      bg: 'bg-amber-950/40 light:bg-amber-100/90',
      border: 'border-amber-500/40 light:border-amber-300',
      text: 'text-amber-300 light:text-amber-800',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)] light:shadow-none',
      icon: <AlertTriangle className="shrink-0 text-amber-400 light:text-amber-600" strokeWidth={1.75} />,
      label: 'HIGH',
    },
    MEDIUM: {
      bg: 'bg-[#a78b71]/15 light:bg-amber-50/90',
      border: 'border-[#a78b71]/40 light:border-amber-200',
      text: 'text-[#e8d5b7] light:text-amber-900',
      glow: 'shadow-[0_0_15px_rgba(167,139,113,0.15)] light:shadow-none',
      icon: <AlertCircle className="shrink-0 text-[#c9b8a0] light:text-amber-700" strokeWidth={1.75} />,
      label: 'MODERATE',
    },
    LOW: {
      bg: 'bg-emerald-950/40 light:bg-emerald-100/90',
      border: 'border-emerald-500/40 light:border-emerald-300',
      text: 'text-emerald-300 light:text-emerald-800',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)] light:shadow-none',
      icon: <CheckCircle2 className="shrink-0 text-emerald-400 light:text-emerald-600" strokeWidth={1.75} />,
      label: 'LOW',
    },
  }[computedLevel];

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 [&_svg]:w-3 [&_svg]:h-3',
    md: 'text-xs px-2.5 py-1 gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 [&_svg]:w-4 [&_svg]:h-4',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded-full border backdrop-blur-md transition-all select-none ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeStyles} ${className}`}
    >
      {config.icon}
      {code ? (
        <span>{code}</span>
      ) : (
        <span>{config.label}</span>
      )}
      {showScore && score !== undefined && (
        <span className="font-mono opacity-80 pl-1 border-l border-white/15">
          {score}
        </span>
      )}
    </span>
  );
};
