import React from 'react';

interface HandDrawnConnectorProps {
  className?: string;
  color?: string;
  dashed?: boolean;
}

export const HandDrawnConnector: React.FC<HandDrawnConnectorProps> = ({
  className = 'w-full h-8',
  color = '#2d2d2d',
  dashed = true,
}) => {
  return (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 20C45 8 95 32 145 12C165 4 185 24 195 20"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray={dashed ? '6 4' : undefined}
        strokeLinecap="round"
      />
    </svg>
  );
};
