import React from 'react';
import { OrnateDivider } from './OrnateDivider';

interface VolumeHeaderProps {
  volume?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const VolumeHeader: React.FC<VolumeHeaderProps> = ({
  volume = 'VOLUME I',
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`space-y-2 border-b border-[#4A3F35] pb-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-['Cinzel'] font-bold tracking-[0.25em] text-[#C9A962] uppercase">
              {volume}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] tracking-tight mt-0.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-[#9C8B7A] font-['Crimson_Pro'] italic mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      </div>
    </div>
  );
};
