import React from 'react';
import { CornerFlourish } from './CornerFlourish';

export interface ClassicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'paper' | 'yellow' | 'red' | 'blue' | 'green' | 'default';
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
    default: 'bg-[#251E19] border-[#4A3F35] text-[#E8DFD4]',
    white: 'bg-[#251E19] border-[#4A3F35] text-[#E8DFD4]',
    paper: 'bg-[#251E19] border-[#4A3F35] text-[#E8DFD4]',
    yellow: 'bg-[#251E19] border-[#C9A962]/40 text-[#E8DFD4]',
    red: 'bg-[#251E19] border-[#8B2635] text-[#E8DFD4] shadow-crimson-glow',
    blue: 'bg-[#251E19] border-[#C9A962]/30 text-[#E8DFD4]',
    green: 'bg-[#251E19] border-[#2e7d32]/50 text-[#E8DFD4]',
  }[variant];

  const interactiveClass = isInteractive
    ? 'cursor-pointer transition-all duration-300 hover:border-[#C9A962]/60 hover:shadow-card-hover'
    : 'transition-all duration-300 hover:border-[#C9A962]/30';

  const showFlourish =
    decoration === 'flourish' ||
    decoration === 'tack-red' ||
    decoration === 'tape-top' ||
    variant === 'red';

  return (
    <div
      className={`relative border rounded-[4px] p-5 shadow-card-hover ${bgAndBorderClasses} ${interactiveClass} ${className}`}
      {...props}
    >
      {showFlourish && (
        <CornerFlourish
          size="sm"
          color={variant === 'red' || decoration === 'tack-red' ? '#8B2635' : '#C9A962'}
        />
      )}
      {children}
    </div>
  );
};

export const WobblyCard = ClassicalCard;
