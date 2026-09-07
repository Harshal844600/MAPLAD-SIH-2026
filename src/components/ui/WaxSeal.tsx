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
    sm: 'w-10 h-10 text-[9px]',
    md: 'w-14 h-14 text-[11px]',
    lg: 'w-20 h-20 text-xs',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full wax-seal text-[#E8DFD4] font-['Cinzel'] font-bold select-none ${dim} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-1 rounded-full border border-[#fca5a5]/30 flex items-center justify-center text-center p-1 leading-tight">
        <span className="tracking-widest uppercase text-engraved drop-shadow">{displayLabel}</span>
      </div>
    </div>
  );
};

