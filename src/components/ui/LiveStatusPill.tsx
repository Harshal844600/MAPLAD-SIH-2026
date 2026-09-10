import React from 'react';

export interface LiveStatusPillProps {
  statusText?: string;
  label?: string;
  isLive?: boolean;
  className?: string;
  dotColor?: 'emerald' | 'amber' | 'crimson' | 'gold';
}

export const LiveStatusPill: React.FC<LiveStatusPillProps> = ({
  statusText,
  label,
  isLive = true,
  className = '',
  dotColor = 'emerald',
}) => {
  const textToDisplay = label || statusText || 'Forensic Neural Scan Active';

  const dotColorClasses = {
    emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    amber: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    crimson: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    gold: 'bg-[#e8d5b7] shadow-[0_0_8px_rgba(232,213,183,0.8)]',
  }[dotColor];

  const tagColorClasses = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    crimson: 'text-rose-400',
    gold: 'text-[#e8d5b7]',
  }[dotColor];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] light:bg-slate-100 backdrop-blur-md border border-white/10 light:border-slate-300 rounded-full shadow-sm hover:border-[#a78b71]/30 transition-all ${className}`}
    >
      {/* 8px pulsing status dot */}
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColorClasses}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColorClasses}`} />
      </span>

      {/* Status Label */}
      <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${tagColorClasses}`}>
        LIVE
      </span>

      <span className="text-[12px] font-['Inter'] text-gray-200 light:text-slate-800 font-medium">
        {textToDisplay}
      </span>
    </div>
  );
};
