import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-white hover:border-[#a78b71]/50 hover:shadow-[0_0_15px_rgba(167,139,113,0.25)] transition-all duration-300 cursor-pointer ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Obsidian Dark Mode'}
      aria-label="Toggle Theme Mode"
      id="theme-mode-toggle-btn"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#e8d5b7] transition-transform duration-500 rotate-0 group-hover:rotate-45" strokeWidth={1.8} />
        ) : (
          <Moon className="w-4 h-4 text-[#8C735D] transition-transform duration-500 rotate-0 group-hover:-rotate-12" strokeWidth={1.8} />
        )}
      </div>

      {showLabel ? (
        <span className="text-xs font-['Inter'] tracking-wider font-semibold">
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </span>
      ) : (
        <span className="hidden sm:inline-block text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] uppercase">
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </span>
      )}
    </button>
  );
};
