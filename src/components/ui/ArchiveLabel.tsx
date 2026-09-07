import React from 'react';

interface ArchiveLabelProps {
  children?: React.ReactNode;
  text?: string;
  variant?: 'brass' | 'crimson' | 'muted';
  className?: string;
}

export const ArchiveLabel: React.FC<ArchiveLabelProps> = ({
  children,
  text,
  variant = 'brass',
  className = '',
}) => {
  const colors = {
    brass: 'text-[#C9A962] border-[#C9A962]/40 bg-[#C9A962]/5',
    crimson: 'text-[#fca5a5] border-[#8B2635] bg-[#8B2635]/20',
    muted: 'text-[#9C8B7A] border-[#4A3F35] bg-[#251E19]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-['Cinzel'] font-bold tracking-[0.2em] uppercase border rounded-[2px] ${colors} ${className}`}
    >
      {text || children}
    </span>
  );
};

