import React from 'react';

interface SquiggleProps {
  className?: string;
  color?: string;
}

export const Squiggle: React.FC<SquiggleProps> = ({
  className = 'w-24 h-4',
  color = '#ff4d4d',
}) => {
  return (
    <svg
      viewBox="0 0 100 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 8C8 3 14 13 20 8C26 3 32 13 38 8C44 3 50 13 56 8C62 3 68 13 74 8C80 3 86 13 92 8C95 5 97 11 98 8"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
