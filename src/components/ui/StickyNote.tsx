import React from 'react';

export interface StickyNoteProps {
  children: React.ReactNode;
  title?: string;
  color?: 'yellow' | 'green' | 'blue' | 'pink';
  pin?: 'tack' | 'tape' | 'none';
  rotate?: 'left' | 'right' | 'none';
  className?: string;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div
      className={`relative p-5 border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-[20px] shadow-sm text-gray-200 hover:border-[#a78b71]/30 transition-all ${className}`}
    >
      {title && (
        <h4 className="font-['Inter'] font-semibold text-xs tracking-wider text-[#c9b8a0] uppercase mb-2 pb-1.5 border-b border-white/10 flex items-center gap-1.5">
          <span className="text-[#a78b71]">✦</span> {title}
        </h4>
      )}
      <div className="text-sm font-['Inter'] text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
};
