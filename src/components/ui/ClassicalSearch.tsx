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
  placeholder = 'Search project code, vendor, district, keyword in the archive...',
  className = '',
  onClear,
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#C9A962] pointer-events-none" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#251E19] text-[#E8DFD4] font-['Crimson_Pro'] text-base border border-[#4A3F35] rounded-[4px] pl-10 pr-10 py-2.5 min-h-[46px] transition-colors focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/30 focus:outline-none placeholder:text-[#9C8B7A] placeholder:italic"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 p-1 text-[#9C8B7A] hover:text-[#C9A962] focus:outline-none transition-colors"
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
