import React from 'react';

export interface SatelliteCardProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  badgeText?: string;
  badgeType?: 'gold' | 'risk' | 'neutral';
  meta?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const SatelliteCard: React.FC<SatelliteCardProps> = ({
  title,
  subtitle,
  imageSrc,
  badgeText,
  badgeType = 'gold',
  meta,
  className = '',
  children,
  onClick,
}) => {
  const badgeClasses = {
    gold: 'border-[#a78b71]/40 bg-[#a78b71]/15 text-[#e8d5b7]',
    risk: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
    neutral: 'border-white/10 bg-white/5 text-gray-300',
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`group relative w-full sm:w-[280px] lg:w-[320px] p-4 bg-white/[0.03] backdrop-blur-[10px] border border-white/10 rounded-[24px] transition-all duration-300 ease-out hover:scale-[1.05] hover:border-[#a78b71]/40 hover:shadow-[0_0_60px_rgba(167,139,113,0.3)] cursor-pointer select-none ${className}`}
    >
      {/* Optional Top Media / Image Preview */}
      {imageSrc && (
        <div className="relative w-full h-36 mb-3 rounded-[20px] overflow-hidden bg-black/40 border border-white/5">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover grayscale contrast-110 brightness-90 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          {badgeText && (
            <span
              className={`absolute top-2.5 right-2.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${badgeClasses}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}

      {/* Card Header & Content */}
      <div className="space-y-1.5">
        {!imageSrc && badgeText && (
          <div className="flex justify-between items-center mb-1">
            <span
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${badgeClasses}`}
            >
              {badgeText}
            </span>
            {meta && <span className="text-[11px] font-mono text-gray-400">{meta}</span>}
          </div>
        )}

        <h4 className="text-base font-semibold font-['Playfair_Display'] text-white group-hover:text-[#e8d5b7] transition-colors leading-snug">
          {title}
        </h4>

        {subtitle && (
          <p className="text-xs font-['Inter'] text-gray-400 leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-3 pt-2 border-t border-white/5">{children}</div>}
      </div>
    </div>
  );
};
