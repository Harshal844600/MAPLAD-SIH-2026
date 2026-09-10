import React from 'react';

interface ArchiveLabelProps {
  children?: React.ReactNode;
  text?: string;
  variant?: 'brass' | 'crimson' | 'muted' | 'gold' | 'emerald';
  className?: string;
}

export const ArchiveLabel: React.FC<ArchiveLabelProps> = ({
  children,
  text,
  variant = 'gold',
  className = '',
}) => {
  const colors = {
    gold: 'text-[#e8d5b7] light:text-[#78350F] border-[#a78b71]/40 light:border-amber-300 bg-[#a78b71]/10 light:bg-amber-50',
    brass: 'text-[#e8d5b7] light:text-[#78350F] border-[#a78b71]/40 light:border-amber-300 bg-[#a78b71]/10 light:bg-amber-50',
    crimson: 'text-rose-300 light:text-rose-700 border-rose-500/40 light:border-rose-300 bg-rose-950/30 light:bg-rose-50',
    emerald: 'text-emerald-300 light:text-emerald-700 border-emerald-500/40 light:border-emerald-300 bg-emerald-950/30 light:bg-emerald-50',
    muted: 'text-gray-400 light:text-slate-600 border-white/10 light:border-slate-200 bg-white/5 light:bg-slate-100',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-mono font-semibold tracking-widest uppercase border rounded-full backdrop-blur-md ${colors} ${className}`}
    >
      {text || children}
    </span>
  );
};
