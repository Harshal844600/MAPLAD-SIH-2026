import React from 'react';
import { CornerFlourish } from './CornerFlourish';

export interface ClassicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'paper' | 'yellow' | 'red' | 'blue' | 'green' | 'default' | 'elevated' | 'glass';
  decoration?: 'none' | 'tape-top' | 'tape-corner' | 'tack-red' | 'tack-blue' | 'tack-yellow' | 'flourish' | 'flourish-crimson';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'red' | 'blue';
  rotate?: 'none' | 'left-slight' | 'right-slight' | 'left' | 'right';
  className?: string;
  isInteractive?: boolean;
}

export const ClassicalCard: React.FC<ClassicalCardProps> = ({
  children,
  variant = 'default',
  decoration = 'none',
  shadow = 'md',
  rotate = 'none',
  className = '',
  isInteractive = false,
  ...props
}) => {
  const bgAndBorderClasses = {
    default: 'bg-white/[0.03] light:bg-white backdrop-blur-[10px] border-white/10 light:border-slate-200 text-gray-100 light:text-slate-800 light:shadow-[0_4px_20px_rgba(15,23,42,0.05)]',
    glass: 'bg-white/[0.04] light:bg-white/90 backdrop-blur-md border-white/10 light:border-slate-200 text-white light:text-slate-900',
    elevated: 'bg-[#121212]/90 light:bg-white backdrop-blur-xl border-[#a78b71]/30 light:border-slate-200 shadow-[0_0_50px_rgba(167,139,113,0.15)] light:shadow-[0_8px_30px_rgba(15,23,42,0.08)] text-white light:text-slate-900',
    white: 'bg-white/[0.03] light:bg-white backdrop-blur-[10px] border-white/10 light:border-slate-200 text-gray-100 light:text-slate-800',
    paper: 'bg-white/[0.03] light:bg-white backdrop-blur-[10px] border-white/10 light:border-slate-200 text-gray-100 light:text-slate-800',
    yellow: 'bg-[#a78b71]/10 light:bg-amber-50 backdrop-blur-md border-[#a78b71]/40 light:border-amber-200 text-white light:text-amber-950 shadow-[0_0_30px_rgba(167,139,113,0.15)] light:shadow-sm',
    red: 'bg-rose-950/20 light:bg-rose-50 backdrop-blur-md border-rose-500/40 light:border-rose-200 text-white light:text-rose-950 shadow-[0_0_30px_rgba(239,68,68,0.2)] light:shadow-sm',
    blue: 'bg-white/[0.03] light:bg-blue-50/50 backdrop-blur-[10px] border-white/10 light:border-slate-200 text-gray-100 light:text-slate-800',
    green: 'bg-emerald-950/20 light:bg-emerald-50 backdrop-blur-md border-emerald-500/40 light:border-emerald-200 text-white light:text-emerald-950 shadow-[0_0_30px_rgba(16,185,129,0.15)] light:shadow-sm',
  }[variant];

  const interactiveClass = isInteractive
    ? 'cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] hover:border-[#a78b71]/50 light:hover:border-[#8C735D] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_30px_rgba(167,139,113,0.25)] light:hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)]'
    : 'transition-all duration-300 ease-out hover:border-white/20 light:hover:border-slate-300';

  const showFlourish =
    decoration === 'flourish' ||
    decoration === 'tack-red' ||
    decoration === 'tape-top' ||
    variant === 'red';

  return (
    <div
      className={`relative border rounded-[24px] p-6 shadow-sm ${bgAndBorderClasses} ${interactiveClass} ${className}`}
      {...props}
    >
      {showFlourish && (
        <CornerFlourish
          size="sm"
          color={variant === 'red' || decoration === 'tack-red' ? '#EF4444' : '#a78b71'}
        />
      )}
      {children}
    </div>
  );
};

export const WobblyCard = ClassicalCard;
export const GlassCard = ClassicalCard;
