import React from 'react';

interface CornerFlourishProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const CornerFlourish: React.FC<CornerFlourishProps> = ({
  size = 'md',
  className = '',
  color = '#C9A962',
}) => {
  const dim = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }[size];

  return (
    <>
      {/* Top Left */}
      <div className={`absolute top-0 left-0 ${dim} pointer-events-none ${className}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M0 8V0H8" stroke={color} strokeWidth="1.5" />
          <circle cx="2" cy="2" r="1.5" fill={color} />
        </svg>
      </div>
      {/* Top Right */}
      <div className={`absolute top-0 right-0 ${dim} pointer-events-none ${className}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M24 8V0H16" stroke={color} strokeWidth="1.5" />
          <circle cx="22" cy="2" r="1.5" fill={color} />
        </svg>
      </div>
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 ${dim} pointer-events-none ${className}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M0 16V24H8" stroke={color} strokeWidth="1.5" />
          <circle cx="2" cy="22" r="1.5" fill={color} />
        </svg>
      </div>
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 ${dim} pointer-events-none ${className}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M24 16V24H16" stroke={color} strokeWidth="1.5" />
          <circle cx="22" cy="22" r="1.5" fill={color} />
        </svg>
      </div>
    </>
  );
};
