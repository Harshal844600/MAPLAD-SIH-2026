import React from 'react';

interface GovernmentStampProps {
  label: string;
  variant?: 'flagged' | 'verified' | 'escalated' | 'confidential' | 'sample';
  className?: string;
}

export const GovernmentStamp: React.FC<GovernmentStampProps> = ({
  label,
  variant = 'flagged',
  className = '',
}) => {
  const styles = {
    flagged: 'text-[#8B2635] border-[#8B2635] bg-[#8B2635]/15',
    verified: 'text-[#C9A962] border-[#C9A962] bg-[#1C1714]',
    escalated: 'text-[#C9A962] border-[#8B2635] bg-[#2A1D1A]',
    confidential: 'text-[#E8DFD4] border-[#8B2635] bg-[#8B2635]/20',
    sample: 'text-[#9C8B7A] border-[#4A3F35] bg-[#1C1714]',
  }[variant];

  return (
    <div
      className={`inline-flex items-center justify-center uppercase font-bold tracking-widest px-3 py-1 text-xs border rounded select-none shadow-sm ${styles} ${className}`}
      aria-hidden="true"
    >
      <span className="font-['Cinzel']">{label}</span>
    </div>
  );
};

