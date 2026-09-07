import React from 'react';

export interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 4, className = '' }) => {
  return (
    <div
      className={`border border-[#4A3F35] rounded-[4px] p-5 bg-[#251E19] animate-pulse ${className}`}
    >
      <div className="h-5 bg-[#3D332B] rounded-[2px] w-2/3 mb-4" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-[#3D332B]/60 rounded-[2px]"
            style={{ width: `${Math.max(45, 95 - i * 15)}%` }}
          />
        ))}
      </div>
    </div>
  );
};
