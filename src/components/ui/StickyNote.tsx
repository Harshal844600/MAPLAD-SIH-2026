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
      className={`relative p-5 border border-[#4A3F35] bg-[#251E19] rounded shadow-md text-[#E8DFD4] ${className}`}
    >
      {title && (
        <h4 className="font-['Cinzel'] font-bold text-xs tracking-wider text-[#C9A962] mb-2 pb-1.5 border-b border-[#4A3F35]">
          ✦ {title}
        </h4>
      )}
      <div className="text-sm font-['Crimson_Pro'] leading-relaxed">{children}</div>
    </div>
  );
};

