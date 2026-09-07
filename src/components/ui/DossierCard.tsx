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
    default: 'border-[#4A3F35] bg-[#251E19]',
    crimson: 'border-[#8B2635] bg-[#251E19]',
    elevated: 'border-[#C9A962]/50 bg-[#251E19] shadow-brass-glow',
  }[variant];

  return (
    <div
      className={`relative p-6 border rounded-[4px] shadow-card-hover ${borderStyles} ${className}`}
      {...props}
    >
      {flourish && <CornerFlourish size="md" color={variant === 'crimson' ? '#8B2635' : '#C9A962'} />}
      {children}
    </div>
  );
};
