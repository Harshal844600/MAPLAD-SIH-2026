import React from 'react';

interface ThumbtackPinProps {
  color?: 'red' | 'blue' | 'yellow' | 'silver';
  className?: string;
  position?: 'top-center' | 'top-left' | 'top-right';
}

export const ThumbtackPin: React.FC<ThumbtackPinProps> = ({
  color = 'red',
  className = '',
  position = 'top-center',
}) => {
  const pinColor = {
    red: '#dc2626',
    blue: '#2563eb',
    yellow: '#ca8a04',
    silver: '#6b7280',
  }[color];

  const posClass = {
    'top-center': 'absolute -top-3 left-1/2 -translate-x-1/2',
    'top-left': 'absolute -top-3 left-3',
    'top-right': 'absolute -top-3 right-3',
  }[position];

  return (
    <div className={`${posClass} z-20 pointer-events-none drop-shadow-md ${className}`} aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="10" fill={pinColor} stroke="#2d2d2d" strokeWidth="2.5" />
        <circle cx="13" cy="13" r="3.5" fill="white" fillOpacity="0.75" />
        <path d="M16 26L16 30" stroke="#2d2d2d" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};
