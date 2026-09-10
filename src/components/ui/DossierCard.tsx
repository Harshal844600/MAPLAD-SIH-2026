import React from 'react';
import { CornerFlourish } from './CornerFlourish';

interface DossierCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  flourish?: boolean;
  className?: string;
  variant?: 'default' | 'crimson' | 'elevated';
}

export const DossierCard: React.FC<DossierCardProps> = ({
  children,
  flourish = true,
  className = '',
  variant = 'default',
  ...props
}) => {
  const borderStyles = {
    default: 'border-white/10 bg-white/[0.03] backdrop-blur-[10px] text-gray-100',
    crimson: 'border-rose-500/30 bg-rose-950/20 backdrop-blur-md text-white shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    elevated: 'border-[#a78b71]/30 bg-[#121212]/90 backdrop-blur-xl shadow-[0_0_60px_rgba(167,139,113,0.15)] text-white',
  }[variant];

  return (
    <div
      className={`relative p-6 sm:p-8 border rounded-[28px] shadow-sm transition-all duration-300 hover:border-[#a78b71]/40 ${borderStyles} ${className}`}
      {...props}
    >
      {flourish && <CornerFlourish size="md" color={variant === 'crimson' ? '#EF4444' : '#a78b71'} />}
      {children}
    </div>
  );
};
