import React from 'react';

interface WaxSealProps {
  label?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  label,
  icon,
  size = 'md',
  className = '',
}) => {
  const displayLabel = icon || label || '★';

  const dim = {
    sm: 'w-9 h-9 text-[9px]',
    md: 'w-12 h-12 text-[10px]',
    lg: 'w-16 h-16 text-xs',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-[#121212] via-[#222222] to-[#333333] border border-[#a78b71]/50 text-[#e8d5b7] font-mono font-bold shadow-[0_0_20px_rgba(167,139,113,0.3)] select-none ${dim} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-1 rounded-full border border-[#c9b8a0]/30 flex items-center justify-center text-center p-1 leading-tight">
        <span className="tracking-widest uppercase">{displayLabel}</span>
      </div>
    </div>
  );
};

export const GovernmentStamp = WaxSeal;
