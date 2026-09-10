import React from 'react';

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
    <div className={`space-y-2 border-b border-white/10 light:border-slate-200 pb-5 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#c9b8a0] light:text-[#78350F] uppercase px-2.5 py-0.5 rounded-full bg-[#a78b71]/10 light:bg-amber-100/80 border border-[#a78b71]/20 light:border-amber-300">
              {volume}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold font-['Playfair_Display'] text-white light:text-slate-900 tracking-tight mt-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-400 light:text-slate-600 font-['Inter'] mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      </div>
    </div>
  );
};
