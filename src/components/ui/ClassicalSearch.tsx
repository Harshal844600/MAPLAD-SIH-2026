import React from 'react';
import { Search, X } from 'lucide-react';

export interface ClassicalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export const ClassicalSearch: React.FC<ClassicalSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search project code, vendor, anomaly ID...',
  className = '',
  onClear,
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#c9b8a0] light:text-[#8C735D] pointer-events-none" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] light:bg-white text-white light:text-slate-900 font-['Inter'] text-sm border border-white/10 light:border-slate-300 rounded-full pl-10 pr-10 py-2.5 min-h-[44px] transition-all focus:border-[#a78b71] light:focus:border-[#8C735D] focus:ring-2 focus:ring-[#a78b71]/30 light:focus:ring-[#8C735D]/20 focus:outline-none placeholder:text-gray-500 light:placeholder:text-slate-400 shadow-xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3.5 p-1 text-gray-400 hover:text-white light:text-slate-400 light:hover:text-slate-900 focus:outline-none transition-colors cursor-pointer"
          title="Clear search query"
          aria-label="Clear search query"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

export const SketchSearch = ClassicalSearch;
export const GlassSearch = ClassicalSearch;
