import React from 'react';

export interface NeuralConnectionLinesProps {
  className?: string;
  variant?: 'branch' | 'flow' | 'radial';
  width?: number | string;
  height?: number | string;
}

export const NeuralConnectionLines: React.FC<NeuralConnectionLinesProps> = ({
  className = '',
  variant = 'branch',
  width = '100%',
  height = '100%',
}) => {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      width={width}
      height={height}
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="neural-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9b8a0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78b71" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="neural-gold-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8d5b7" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a78b71" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78b71" stopOpacity="0" />
        </linearGradient>
        <filter id="gold-line-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Neural Branch Paths */}
      <path
        d="M 100 200 C 250 200, 300 100, 400 100 C 500 100, 550 200, 700 200"
        className="node-line"
        filter="url(#gold-line-blur)"
      />
      <path
        d="M 100 200 C 250 200, 300 300, 400 300 C 500 300, 550 200, 700 200"
        className="node-line"
        filter="url(#gold-line-blur)"
      />
      <path
        d="M 400 100 L 400 300"
        className="node-line"
        filter="url(#gold-line-blur)"
      />

      {/* Secondary Dashed Flow Stream */}
      {(variant === 'flow' || variant === 'branch') && (
        <>
          <path
            d="M 100 200 C 250 200, 300 100, 400 100 C 500 100, 550 200, 700 200"
            stroke="url(#neural-gold-glow)"
            strokeWidth="1.5"
            className="node-flow-line"
            fill="none"
          />
          <path
            d="M 100 200 C 250 200, 300 300, 400 300 C 500 300, 550 200, 700 200"
            stroke="url(#neural-gold-glow)"
            strokeWidth="1.5"
            className="node-flow-line"
            fill="none"
          />
        </>
      )}

      {/* Central Neural Hub Node */}
      <circle cx="400" cy="200" r="18" fill="#0a0a0a" stroke="#c9b8a0" strokeWidth="2" />
      <circle cx="400" cy="200" r="8" fill="#a78b71" className="animate-ping opacity-60" />
      <circle cx="400" cy="200" r="6" fill="#e8d5b7" />

      {/* Sub Nodes */}
      <circle cx="400" cy="100" r="5" fill="#c9b8a0" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="400" cy="300" r="5" fill="#c9b8a0" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="100" cy="200" r="6" fill="#a78b71" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="700" cy="200" r="6" fill="#a78b71" stroke="#0a0a0a" strokeWidth="1.5" />
    </svg>
  );
};
