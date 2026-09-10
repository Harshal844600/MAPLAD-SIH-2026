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
    star: '✦',
    flourish: '◈',
    diamond: '◆',
    leaf: '✧',
  }[glyph];

  return (
    <div className={`relative flex items-center justify-center w-full ${className}`} aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#a78b71]/40 to-transparent" />
      </div>
      <div className="relative bg-[#0a0a0a] px-4 text-[#c9b8a0] text-xs select-none">
        {glyphChar}
      </div>
    </div>
  );
};
