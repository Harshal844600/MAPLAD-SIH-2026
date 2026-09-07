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
      className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border border-[#4A3F35] bg-[#251E19] text-[#E8DFD4] hover:border-[#C9A962] hover:shadow-[0_0_12px_rgba(201,169,98,0.2)] transition-all duration-300 ${className}`}
      title={theme === 'dark' ? 'Switch to Classical Parchment Light Mode' : 'Switch to Archival Mahogany Dark Mode'}
      aria-label="Toggle Classical Light/Dark Theme"
      id="theme-mode-toggle-btn"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#C9A962] transition-transform duration-500 rotate-0 group-hover:rotate-45" strokeWidth={1.8} />
        ) : (
          <Moon className="w-4 h-4 text-[#B8923A] transition-transform duration-500 rotate-0 group-hover:-rotate-12" strokeWidth={1.8} />
        )}
      </div>

      {showLabel ? (
        <span className="text-xs font-['Cinzel'] tracking-wider font-semibold">
          {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
        </span>
      ) : (
        <span className="hidden sm:inline-block text-[11px] font-['Cinzel'] font-bold tracking-widest text-[#C9A962] uppercase">
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </span>
      )}
    </button>
  );
};
