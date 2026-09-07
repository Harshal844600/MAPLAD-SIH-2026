import React from 'react';

interface RoughCircleProps {
  className?: string;
  color?: string;
  children?: React.ReactNode;
}

export const RoughCircle: React.FC<RoughCircleProps> = ({
  className = 'w-12 h-12',
  color = '#ff4d4d',
  children,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M50 8C22 8 8 26 8 52C8 76 25 92 52 92C78 92 92 74 92 48C92 24 74 6 48 8C30 9.5 15 28 20 54"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </div>
  );
};
