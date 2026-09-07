import React from 'react';

interface TapeStripProps {
  position?: 'top-center' | 'top-left' | 'top-right' | 'diagonal-left' | 'diagonal-right';
  className?: string;
  variant?: 'beige' | 'yellow' | 'clear';
}

export const TapeStrip: React.FC<TapeStripProps> = ({
  position = 'top-center',
  className = '',
  variant = 'beige',
}) => {
  const bgColors = {
    beige: 'bg-[#eee6d2]/85',
    yellow: 'bg-[#fef08a]/80',
    clear: 'bg-white/60',
  }[variant];

  const positionClasses = {
    'top-center': 'absolute -top-3 left-1/2 -translate-x-1/2 -rotate-1 w-24 h-6 z-20',
    'top-left': 'absolute -top-2.5 -left-3 -rotate-12 w-20 h-5 z-20',
    'top-right': 'absolute -top-2.5 -right-3 rotate-12 w-20 h-5 z-20',
    'diagonal-left': 'absolute -top-3 -left-5 -rotate-45 w-24 h-6 z-20',
    'diagonal-right': 'absolute -top-3 -right-5 rotate-45 w-24 h-6 z-20',
  }[position];

  return (
    <div
      className={`${positionClasses} ${bgColors} shadow-sm backdrop-blur-[0.5px] border-x-2 border-dashed border-[#c8bea7]/60 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
