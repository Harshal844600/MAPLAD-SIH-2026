import React from 'react';

interface WavyUnderlineProps {
  className?: string;
  color?: string;
}

export const WavyUnderline: React.FC<WavyUnderlineProps> = ({
  className = 'w-full h-3',
  color = '#ff4d4d',
}) => {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 6C20 1 40 11 60 6C80 1 100 11 120 6C140 1 160 11 180 6C190 3 195 9 198 6"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
