import React from 'react';

interface OrnateDividerProps {
  glyph?: 'star' | 'flourish' | 'diamond' | 'leaf';
  className?: string;
}

export const OrnateDivider: React.FC<OrnateDividerProps> = ({
  glyph = 'star',
  className = 'my-6',
}) => {
  const glyphChar = {
    star: '✶',
    flourish: '❧',
    diamond: '✤',
    leaf: '❦',
  }[glyph];

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`} aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#4A3F35] via-[#C9A962]/60 to-transparent" />
      </div>
      <div className="relative bg-[#1C1714] px-4 text-[#C9A962] text-sm select-none">
        {glyphChar}
      </div>
    </div>
  );
};
