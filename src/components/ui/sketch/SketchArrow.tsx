import React from 'react';

interface SketchArrowProps {
  direction?: 'right' | 'left' | 'down' | 'curved-right' | 'curved-down';
  className?: string;
  color?: string;
}

export const SketchArrow: React.FC<SketchArrowProps> = ({
  direction = 'right',
  className = 'w-12 h-8',
  color = '#2d2d2d',
}) => {
  if (direction === 'curved-right') {
    return (
      <svg
        viewBox="0 0 100 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M5 32C25 10 65 8 92 18M92 18L76 8M92 18L80 32"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (direction === 'curved-down') {
    return (
      <svg
        viewBox="0 0 40 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M12 5C32 25 32 50 20 72M20 72L10 56M20 72L32 60"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (direction === 'down') {
    return (
      <svg
        viewBox="0 0 30 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M15 5C14 22 16 40 15 52M15 52L6 40M15 52L24 40"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 60 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 15C20 14 38 16 52 15M52 15L40 6M52 15L40 24"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
