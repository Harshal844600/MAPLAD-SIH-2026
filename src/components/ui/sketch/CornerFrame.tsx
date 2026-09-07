import React from 'react';

interface CornerFrameProps {
  className?: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const CornerFrame: React.FC<CornerFrameProps> = ({
  className = 'w-6 h-6',
  color = '#2d2d2d',
  position = 'top-left',
}) => {
  const rotationClass = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${rotationClass}`}
      aria-hidden="true"
    >
      <path
        d="M38 6C20 5 6 6 6 6C6 6 5 20 6 38"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
